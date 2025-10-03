
import React, { useState, useEffect, useMemo, useRef, FC } from 'react';
// FIX: Corrected import paths for local components and modules.
// The component was likely moved, and these paths were not updated,
// leading to module resolution failures and type inference errors.
import Dashboard from './Dashboard';
import LessonView from './LessonView';
import PracticeView from './PracticeView';
import ProfileModal from './ProfileModal';
import ProfileView from './ProfileView';
import BadgeUnlockedModal from './BadgeUnlockedModal';
import LoginView from './LoginView';
import LeaderboardView from './LeaderboardView';
import LessonCompleteView from './LessonCompleteView';
import FriendsView from './FriendsView';
import UserPublicProfileView from './UserPublicProfileView';
import ChatView from './ChatView';
import { AVATARS } from './Avatars';
import { CURRICULA } from '../curriculum';
import { BADGES } from '../rewards';
import { Lesson, Progress, UserProfile, PracticeQuestion, Badge, ThemeColor, Unit } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Added ChatDots to the import from Icons.tsx.
import { AtomIcon, MoleculeIcon, Spinner, Sun, Moon, Trophy, People, ChatDots } from './Icons';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

type View = 'dashboard' | 'lesson' | 'practice' | 'profile' | 'leaderboard' | 'lesson-complete' | 'friends' | 'user-profile' | 'chat';
type Theme = 'light' | 'dark';

// FIX: The API key must be obtained from `process.env.API_KEY` as per the coding guidelines.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const LOADING_MESSAGES = [
    "Calibrating the Bunsen burner...",
    "Running quantum calculations...",
    "Counting Avogadro's number of possibilities...",
    "Balancing the chemical equations...",
    "Synthesizing your quiz...",
    "Precipitating practice problems...",
    "Polishing the laboratory glassware...",
    "Consulting the periodic table of elements...",
    "Stirring the solution of knowledge...",
    "Aligning electron orbitals...",
];

const FullScreenLoader: FC<{ message: string }> = ({ message }) => (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center z-50">
        <div className="text-center p-8">
            <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
                <AtomIcon className="absolute w-32 h-32 text-blue-300 animate-spin-slow" />
                <MoleculeIcon className="absolute w-24 h-24 text-purple-300 animate-pulse delay-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-8 transition-opacity duration-500">
                {message}
            </h2>
        </div>
    </div>
);

// FIX: Changed React.FC to FC to resolve a typing issue where the component was incorrectly inferred as returning void.
const PracticeLoadingView: FC = () => {
    const [messageIndex, setMessageIndex] = useState(() => Math.floor(Math.random() * LOADING_MESSAGES.length));

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % LOADING_MESSAGES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
         <div className="flex flex-col items-center justify-center text-center p-8 min-h-[500px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <AtomIcon className="absolute w-32 h-32 text-blue-300 animate-spin-slow" />
                <MoleculeIcon className="absolute w-24 h-24 text-purple-300 animate-pulse delay-500" />
                <div className="text-7xl relative">😺</div>
            </div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-8 transition-opacity duration-500">
                {LOADING_MESSAGES[messageIndex]}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
                Please wait while ChemCat prepares your practice session.
            </p>
        </div>
    )
};

const App: FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [progress, setProgress] = useState<Progress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme') as Theme;
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const [currentView, setCurrentView] = useState<View>('dashboard');
    // FIX: Add state to track the previous view to fix navigation logic.
    const [fromView, setFromView] = useState<View>('dashboard');
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const [currentSubject, setCurrentSubject] = useState('chemistry');
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [activeUnit, setActiveUnit] = useState<{ color: string, bgColor: string, darkColor?: string, darkBgColor?: string } | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[] | null>(null);
    const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);
    const practiceGenerationPromises = useMemo(() => new Map<string, Promise<PracticeQuestion[]>>(), []);
    const unitPracticeGenerationPromises = useMemo(() => new Map<string, Promise<PracticeQuestion[]>>(), []);
    const [activePractice, setActivePractice] = useState<{title: string, onComplete: () => void} | null>(null);
    const [newWeakTopics, setNewWeakTopics] = useState<Set<string>>(new Set());
    
    const [notification, setNotification] = useState<string | null>(null);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
    const [lessonSummary, setLessonSummary] = useState<{
        xpEarned: number;
        oldStreak: number;
        newStreak: number;
    } | null>(null);

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const subjectDropdownRef = useRef<HTMLDivElement>(null);

    const UNITS = useMemo(() => CURRICULA[currentSubject].units, [currentSubject]);
    const allLessons = useMemo(() => Object.values(CURRICULA).flatMap(c => c.units).flatMap(u => u.lessons), []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
            if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target as Node)) {
                setIsSubjectDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Supabase auth listener
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    await supabase.auth.signOut();
                } else if (profile) {
                    const today = new Date().toISOString().split('T')[0];
                    const isNewDay = profile.last_completed_date !== today;
                    
                    const userMetadata = session.user.user_metadata || {};

                    setUser({
                        id: profile.id,
                        email: session.user.email || '',
                        username: profile.username || (session.user.email || '').split('@')[0], // Fallback for existing users
                        name: profile.name,
                        avatar: profile.avatar,
                        themeColor: profile.themeColor,
                        dailyGoal: userMetadata.dailyGoal || 50,
                        focusedSubjects: userMetadata.focusedSubjects || ['chemistry'],
                    });
                    setProgress({
                        completedLessons: profile.completed_lessons || [],
                        streak: profile.streak || 0,
                        lastCompletedDate: profile.last_completed_date || null,
                        streakFreezesAvailable: profile.streak_freezes_available || 0,
                        earnedBadgeIds: profile.earned_badge_ids || [],
                        energy: profile.energy || 0,
                        weakTopics: profile.weak_topics || [],
                        dailyXP: isNewDay ? 0 : profile.daily_xp || 0,
                    });
                }
            } else {
                setUser(null);
                setProgress(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Theme handler
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
    
    const updateProgressOnDb = async (newProgress: Partial<Progress>) => {
        if (!user) return;
        const { error } = await supabase.from('profiles').update(
            {
                completed_lessons: newProgress.completedLessons,
                streak: newProgress.streak,
                last_completed_date: newProgress.lastCompletedDate,
                streak_freezes_available: newProgress.streakFreezesAvailable,
                earned_badge_ids: newProgress.earnedBadgeIds,
                energy: newProgress.energy,
                weak_topics: newProgress.weakTopics,
                daily_xp: newProgress.dailyXP,
            }
        ).eq('id', user.id);
        if (error) console.error("Error updating progress:", error);
    };

    const isLessonUnlocked = (lessonId: string): boolean => {
        if (!progress) return false;
        const lesson = allLessons.find(l => l.id === lessonId);
        if (!lesson) return false;
        if (lesson.dependencies.length === 0) return true;
        return lesson.dependencies.every(depId => progress.completedLessons.includes(depId));
    };

    const generatePracticeQuestions = async (lesson: Lesson, retry: boolean = false, unit: Unit | null = null, strengthenTopics: string[] = []): Promise<PracticeQuestion[]> => {
        const cacheKey = unit ? `unit-${unit.id}` : `lesson-${lesson.id}`;
        const promiseMap = unit ? unitPracticeGenerationPromises : practiceGenerationPromises;

        if (!retry && promiseMap.has(cacheKey)) {
            return promiseMap.get(cacheKey)!;
        }

        const lessonContext = lesson.slides.map(slide => {
            const title = slide.title ? `Title: ${slide.title}\n` : '';
            return `${title}${slide.content}`;
        }).join('\n\n');

        let prompt;
        if (strengthenTopics.length > 0) {
            prompt = `Based on these topics the user is weak in: ${strengthenTopics.join(', ')}, and the provided context from a lesson on "${lesson.title}", generate 5 diverse practice questions to help them master these concepts.
            Context: ${lessonContext}`;
        } else {
            prompt = `Based on the provided context from a lesson titled "${lesson.title}", generate exactly 5 diverse practice questions to test understanding. The question types should be a mix of 'multiple-choice', 'fill-in-the-blank' (using "___" for the blank), and 'select-all-that-apply'. For each question, provide a brief, helpful explanation that appears after the user answers.
            Context: ${lessonContext}`;
        }

        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "Can be 'multiple-choice', 'fill-in-the-blank', or 'select-all-that-apply'." },
                    question: { type: Type.STRING, description: "The question text. For 'fill-in-the-blank', use '___' for the blank." },
                    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of options for multiple-choice or select-all questions." },
                    answer: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array containing the correct answer(s)." },
                    alternatives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Optional array of acceptable alternative answers for fill-in-the-blank." },
                    explanation: { type: Type.STRING, description: "A brief explanation of the correct answer." }
                },
            },
        };

        const generationPromise = (async () => {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: schema,
                    },
                });
                const jsonStr = response.text.trim();
                const parsed = JSON.parse(jsonStr);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                console.error("Error generating practice questions:", error);
                setNotification("ChemCat is having trouble generating questions. Please try again later.");
                return [];
            }
        })();

        promiseMap.set(cacheKey, generationPromise);
        return generationPromise;
    };

    const handleStartLesson = (lesson: Lesson) => {
        setActiveLesson(lesson);
        const unit = UNITS.find(u => u.lessons.some(l => l.id === lesson.id));
        if (unit) {
            setActiveUnit({ color: unit.color, bgColor: unit.bgColor, darkColor: unit.darkColor, darkBgColor: unit.darkBgColor });
        }
        setCurrentView('lesson');
    };
    
    const handleStartPractice = async (lesson: Lesson, retry: boolean = false, unit: Unit | null = null, strengthen: boolean = false) => {
        setCurrentView('practice');
        setIsGeneratingPractice(true);
        setPracticeQuestions(null);
        setNewWeakTopics(new Set());
        
        const topics = strengthen ? progress?.weakTopics || [] : [];
        const questions = await generatePracticeQuestions(lesson, retry, unit, topics);
        
        setPracticeQuestions(questions);
        setActivePractice({
            title: unit ? `${unit.title} Review` : lesson.title,
            onComplete: () => unit ? handleBackToDashboard() : handleCompleteLesson()
        });
        setIsGeneratingPractice(false);
    };

    const handleCompleteLesson = async () => {
        if (!user || !progress || !activeLesson) return;

        const isAlreadyCompleted = progress.completedLessons.includes(activeLesson.id);
        
        const oldStreak = progress.streak;
        let newStreak = progress.streak;
        let newLastCompletedDate = progress.lastCompletedDate;
        const today = new Date().toISOString().split('T')[0];
        let currentDailyXP = progress.dailyXP;

        if (progress.lastCompletedDate !== today) {
            currentDailyXP = 0; // Reset daily XP for the new day
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (progress.lastCompletedDate === yesterday.toISOString().split('T')[0]) {
                newStreak++; // Continue streak
            } else {
                newStreak = 1; // Start new streak
            }
            newLastCompletedDate = today;
        }

        const newCompletedLessons = isAlreadyCompleted ? progress.completedLessons : [...progress.completedLessons, activeLesson.id];
        const xpEarned = isAlreadyCompleted ? 10 : 50;
        const newEnergy = progress.energy + xpEarned;
        const newDailyXP = currentDailyXP + xpEarned;

        const newlyUnlockedBadges = BADGES.filter(badge => 
            !progress.earnedBadgeIds.includes(badge.id) && newStreak >= badge.streakRequirement
        );
        const newBadgeIds = [...progress.earnedBadgeIds, ...newlyUnlockedBadges.map(b => b.id)];

        const updatedWeakTopics = Array.from(new Set([...progress.weakTopics, ...Array.from(newWeakTopics)]));

        const newProgress: Progress = {
            ...progress,
            completedLessons: newCompletedLessons,
            streak: newStreak,
            lastCompletedDate: newLastCompletedDate,
            energy: newEnergy,
            earnedBadgeIds: newBadgeIds,
            weakTopics: updatedWeakTopics,
            dailyXP: newDailyXP,
        };
        
        setProgress(newProgress);
        await updateProgressOnDb(newProgress);
        
        if (newlyUnlockedBadges.length > 0) {
            setUnlockedBadge(newlyUnlockedBadges[0]);
        }

        setLessonSummary({ xpEarned, oldStreak, newStreak });
        setCurrentView('lesson-complete');
    };
    
    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
        setActiveLesson(null);
        setPracticeQuestions(null);
        setLessonSummary(null);
        setViewingUserId(null);
    };
    
    const handleSaveProfile = async (newUser: UserProfile) => {
        if (!user || !session) return;

        let notificationMessage = '';
        let hasError = false;

        // 1. Update email if it has changed
        if (newUser.email !== session.user.email) {
            const { error: authEmailError } = await supabase.auth.updateUser({ email: newUser.email });
            if (authEmailError) {
                console.error("Error updating email:", authEmailError);
                setNotification(`Failed to update email: ${authEmailError.message}`);
                return;
            }
            notificationMessage += 'Verification link sent to your new email. ';
        }

        // 2. Update profile data in the 'profiles' table (name, avatar, theme, username)
        const { error: profileError } = await supabase.from('profiles').update({
            name: newUser.name,
            avatar: newUser.avatar,
            themeColor: newUser.themeColor,
            username: newUser.username,
        }).eq('id', user.id);
        
        if (profileError) {
            console.error("Error saving profile data:", profileError);
            if (profileError.message.includes('profiles_username_key')) {
                setNotification('That username is already taken. Please choose another.');
            } else {
                setNotification(`Failed to save profile: ${profileError.message}`);
            }
            hasError = true;
        }
        
        // 3. Update learning goals in auth metadata
        const { error: authError } = await supabase.auth.updateUser({
            data: {
                dailyGoal: newUser.dailyGoal,
                focusedSubjects: newUser.focusedSubjects,
            }
        });

        if (authError) {
            console.error("Error saving learning goals:", authError);
            setNotification(`Failed to save learning goals: ${authError.message}`);
            hasError = true;
        }

        if (!hasError) {
            // Optimistically update local state. A page refresh will sync with the new email after verification.
            setUser(prevUser => ({
                ...prevUser!,
                ...newUser,
                email: prevUser!.email // Keep old email in UI until verified
            }));
            setIsProfileModalOpen(false);
            notificationMessage += 'Profile saved successfully!';
            setNotification(notificationMessage.trim());
        }

        setTimeout(() => setNotification(null), 5000);
    };
    
    const handleResetProgress = async () => {
        if (!user || !progress) return;
        const initialProgress: Progress = {
            completedLessons: [], streak: 0, lastCompletedDate: null,
            streakFreezesAvailable: 1, earnedBadgeIds: [], energy: 0, weakTopics: [],
            dailyXP: 0
        };
        setProgress(initialProgress);
        await updateProgressOnDb(initialProgress);
        setCurrentView('dashboard');
    };
    
    const handleDeleteAccount = async () => {
        const { error } = await supabase.rpc('delete_user');
        if (error) {
            console.error("Error deleting account:", error);
            setNotification("Failed to delete account. Please try again.");
        } else {
            await supabase.auth.signOut();
        }
    };
    
    const handleViewProfile = (userId: string) => {
        if (userId === user?.id) {
            setCurrentView('profile');
        } else {
            setViewingUserId(userId);
            setCurrentView('user-profile');
        }
    };
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    
    const handleQuestionIncorrect = (topic: string) => {
        setNewWeakTopics(prev => new Set(prev).add(topic));
    };
    
    const AvatarComponent = user ? AVATARS[user.avatar] : AVATARS['avatar1'];

    if (isLoading) return <FullScreenLoader message="Waking up ChemCat..." />;
    if (!session || !user || !progress) return <LoginView />;

    const renderView = () => {
        switch (currentView) {
            case 'lesson':
                return activeLesson && activeUnit ? <LessonView lesson={activeLesson} unitColor={activeUnit.color} unitBgColor={activeUnit.bgColor} unitDarkColor={activeUnit.darkColor} unitDarkBgColor={activeUnit.darkBgColor} onBack={handleBackToDashboard} onStartPractice={() => handleStartPractice(activeLesson)} /> : null;
            case 'practice':
                return isGeneratingPractice ? <PracticeLoadingView /> : (practiceQuestions && activeLesson && activeUnit && activePractice) ? <PracticeView questions={practiceQuestions} onComplete={activePractice.onComplete} onBack={handleBackToDashboard} unitBgColor={activeUnit.bgColor} practiceTitle={activePractice.title} onQuestionIncorrect={handleQuestionIncorrect} /> : null;
            case 'profile':
                return <ProfileView user={user} progress={progress} onBack={handleBackToDashboard} onEditProfile={() => setIsProfileModalOpen(true)} onResetProgress={handleResetProgress} onDeleteAccount={handleDeleteAccount} />;
            case 'leaderboard':
                return <LeaderboardView user={user} onBack={handleBackToDashboard} onViewProfile={handleViewProfile} />;
            case 'lesson-complete':
                return lessonSummary ? <LessonCompleteView summary={lessonSummary} onContinue={handleBackToDashboard} /> : null;
            case 'friends':
                return <FriendsView user={user} onBack={handleBackToDashboard} onViewProfile={handleViewProfile} />;
            case 'user-profile':
                return viewingUserId ? <UserPublicProfileView viewingUserId={viewingUserId} currentUser={user} onBack={() => setCurrentView(fromView)} /> : null;
            case 'chat':
                return <ChatView onBack={handleBackToDashboard} />;
            case 'dashboard':
            default:
                return <Dashboard 
                    units={UNITS} 
                    progress={progress} 
                    onStartLesson={handleStartLesson} 
                    isLessonUnlocked={isLessonUnlocked} 
                    notification={notification}
                    onDismissNotification={() => setNotification(null)}
                    curricula={CURRICULA}
                    onStartUnitPractice={(unit) => {
                        const firstLesson = unit.lessons[0];
                        if (firstLesson) handleStartPractice(firstLesson, false, unit);
                    }}
                    onStartStrengthenSkills={() => {
                        const firstLesson = allLessons[0];
                        if (firstLesson) handleStartPractice(firstLesson, false, null, true);
                    }}
                />;
        }
    };

    return (
        <>
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
                <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-40 border-b dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-4">
                                <div className="text-3xl">🧪😺</div>
                                <h1 className="text-xl font-bold text-purple-700 dark:text-purple-400">ChemCat</h1>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-2 rounded-md text-sm font-bold transition-colors ${currentView === 'dashboard' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400'}`}>Learn</button>
                                <button onClick={() => setCurrentView('leaderboard')} title="Leaderboard" className={`p-2 rounded-full transition-colors ${currentView === 'leaderboard' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400'}`}><Trophy className="text-2xl"/></button>
                                <button onClick={() => setCurrentView('friends')} title="Friends" className={`p-2 rounded-full transition-colors ${currentView === 'friends' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400'}`}><People className="text-2xl"/></button>
                                <button onClick={() => setCurrentView('chat')} title="Chat" className={`p-2 rounded-full transition-colors ${currentView === 'chat' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400'}`}><ChatDots className="text-2xl"/></button>
                                <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400" title="Toggle Theme">
                                    {theme === 'light' ? <Moon className="text-2xl"/> : <Sun className="text-2xl"/>}
                                </button>
                                <div className="relative" ref={profileDropdownRef}>
                                    <button onClick={() => setIsProfileDropdownOpen(p => !p)}>
                                        <AvatarComponent className="w-10 h-10" />
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 animate-fade-in-up">
                                            <button onClick={() => { setCurrentView('profile'); setIsProfileDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">My Profile</button>
                                            <button onClick={() => { setIsProfileModalOpen(true); setIsProfileDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">Settings</button>
                                            <button onClick={() => supabase.auth.signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-600">Sign Out</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderView()}
                </main>
            </div>
            {isProfileModalOpen && <ProfileModal user={user} onSave={handleSaveProfile} onClose={() => setIsProfileModalOpen(false)} />}
            {unlockedBadge && <BadgeUnlockedModal badge={unlockedBadge} onClose={() => setUnlockedBadge(null)} />}
        </>
    );
};

export default App;
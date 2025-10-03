
import React, { useState } from 'react';
import { UserProfile, Progress, ThemeColor } from '../types';
import { CURRICULA } from '../curriculum';
import { BADGES } from '../rewards';
import { AVATARS } from './Avatars';
import { ArrowLeft, BookOpen, ChartPie, Cog, Flame, ShieldCheck } from './Icons';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-8 relative animate-fade-in-up text-center">
                <div className="text-6xl mb-4">🙀</div>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">{title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
                
                <div className="flex flex-col sm:flex-row-reverse gap-3">
                     <button 
                        onClick={onConfirm}
                        className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                    >
                        {confirmText}
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ProfileViewProps {
  user: UserProfile;
  progress: Progress;
  onBack: () => void;
  onEditProfile: () => void;
  onResetProgress: () => void;
  onDeleteAccount: () => void;
}

const THEME_CLASSES: Record<ThemeColor, { bg: string, text: string, gradient: string, darkGradient: string }> = {
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-50 via-white to-white', darkGradient: 'dark:from-slate-800 dark:via-slate-900 dark:to-slate-900' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-50 via-white to-white', darkGradient: 'dark:from-slate-800 dark:via-slate-900 dark:to-slate-900' },
    green: { bg: 'bg-green-100', text: 'text-green-700', gradient: 'from-green-50 via-white to-white', darkGradient: 'dark:from-slate-800 dark:via-slate-900 dark:to-slate-900' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', gradient: 'from-orange-50 via-white to-white', darkGradient: 'dark:from-slate-800 dark:via-slate-900 dark:to-slate-900' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-50 via-white to-white', darkGradient: 'dark:from-slate-800 dark:via-slate-900 dark:to-slate-900' },
};


const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white/50 dark:bg-slate-700/50 p-4 rounded-xl shadow-md flex items-center space-x-4 border dark:border-slate-600 backdrop-blur-sm">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    </div>
);

const DailyGoalCard: React.FC<{ dailyXP: number, dailyGoal: number, theme: typeof THEME_CLASSES[ThemeColor] }> = ({ dailyXP, dailyGoal, theme }) => {
    const progressPercentage = dailyGoal > 0 ? Math.min((dailyXP / dailyGoal) * 100, 100) : 0;
    const goalMet = dailyXP >= dailyGoal;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Today's Goal</h3>
            <div className="flex justify-between items-center mb-1 text-sm font-semibold">
                <span className={`${theme.text} dark:text-purple-400`}>{goalMet ? "Goal Achieved! 🎉" : "Keep going!"}</span>
                <span className="font-extrabold">{dailyXP} / {dailyGoal} XP</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                <div 
                    className={`h-4 rounded-full transition-all duration-500 ${goalMet ? 'bg-green-500 animate-glow' : `${theme.bg.replace('100', '500')} dark:bg-purple-500`}`}
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};


const ProfileView: React.FC<ProfileViewProps> = ({ user, progress, onBack, onEditProfile, onResetProgress, onDeleteAccount }) => {
    const AvatarComponent = AVATARS[user.avatar] || AVATARS['avatar1'];
    const theme = THEME_CLASSES[user.themeColor] || THEME_CLASSES.purple;
    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'reset' | 'delete' | null>(null);

    const allUnits = Object.values(CURRICULA).flatMap(c => c.units);
    const totalLessons = allUnits.flatMap(u => u.lessons).length;
    const completedLessons = progress.completedLessons.length;
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    const flameColor = progress.streak > 0 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500';
    const flameBgColor = progress.streak > 0 ? 'bg-orange-100 dark:bg-orange-900/50' : 'bg-slate-100 dark:bg-slate-700';

    const handleConfirm = () => {
        if (confirmAction === 'reset') {
            onResetProgress();
        } else if (confirmAction === 'delete') {
            onDeleteAccount();
        }
        setIsConfirmOpen(false);
        setConfirmAction(null);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in-up space-y-8">
                <div className={`relative p-4 sm:p-8 rounded-2xl bg-gradient-to-br ${theme.gradient} ${theme.darkGradient}`}>
                    <button onClick={onBack} className="absolute top-4 left-4 flex items-center space-x-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 font-semibold transition-colors">
                        <ArrowLeft className="text-lg" />
                        <span>Dashboard</span>
                    </button>
            
                    <div className="flex flex-col items-center pt-12">
                        <div className="relative">
                            <AvatarComponent className="w-32 h-32" />
                            <button onClick={onEditProfile} className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border dark:border-slate-500" title="Edit Profile">
                                <Cog className="text-xl text-slate-600 dark:text-slate-300"/>
                            </button>
                        </div>
                        <h1 className={`text-4xl font-extrabold ${theme.text} dark:text-purple-400 mt-4`}>{user.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">@{user.username}</p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard 
                            icon={<Flame className={`text-2xl ${flameColor}`} />}
                            label="Day Streak"
                            value={progress.streak}
                            color={flameBgColor}
                        />
                        <StatCard 
                            icon={<BookOpen className="text-2xl text-green-600" />}
                            label="Lessons Completed"
                            value={completedLessons}
                            color="bg-green-100 dark:bg-green-900/50"
                        />
                        <StatCard 
                            icon={<ChartPie className="text-2xl text-blue-600" />}
                            label="Units Mastered"
                            value={`${allUnits.filter(unit => unit.lessons.length > 0 && unit.lessons.every(l => progress.completedLessons.includes(l.id))).length} / ${allUnits.length}`}
                            color="bg-blue-100 dark:bg-blue-900/50"
                        />
                        <StatCard 
                            icon={<ShieldCheck className="text-2xl text-cyan-600" />}
                            label="Streak Freezes"
                            value={progress.streakFreezesAvailable}
                            color="bg-cyan-100 dark:bg-cyan-900/50"
                        />
                    </div>
                </div>

                <DailyGoalCard dailyXP={progress.dailyXP} dailyGoal={user.dailyGoal} theme={theme} />

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Badges Earned</h3>
                    {progress.earnedBadgeIds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {progress.earnedBadgeIds.map(badgeId => {
                                const badge = BADGES.find(b => b.id === badgeId);
                                if (!badge) return null;
                                const BadgeIcon = badge.icon;
                                return (
                                    <div key={badge.id} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600">
                                        <BadgeIcon className="text-4xl text-yellow-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{badge.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{badge.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 italic text-center py-4">No badges earned yet. Keep your streak going to unlock them!</p>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Overall Progress</h3>
                    <div className="flex justify-between items-center mb-1 text-sm font-semibold">
                        <span className="text-purple-700 dark:text-purple-400">ChemCat Curriculum</span>
                        <span>{overallProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                        <div className={`h-4 rounded-full transition-all duration-500 ${theme.bg.replace('100', '500')} dark:bg-purple-500`} style={{ width: `${overallProgress}%` }}></div>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-700/50">
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-4">Danger Zone</h3>
                     <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                        <button 
                            onClick={() => { setConfirmAction('reset'); setIsConfirmOpen(true); }}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-orange-700 bg-orange-100 border-2 border-orange-200 rounded-lg hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-900 transition-colors"
                        >
                            Reset Progress
                        </button>
                        <button 
                             onClick={() => { setConfirmAction('delete'); setIsConfirmOpen(true); }}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-red-700 bg-red-100 border-2 border-red-200 rounded-lg hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900 transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirm}
                title={confirmAction === 'reset' ? 'Reset Progress?' : 'Delete Account?'}
                message={
                    confirmAction === 'reset' 
                    ? 'Are you sure you want to reset all your learning progress? Your completed lessons and streak will be gone forever.'
                    : 'Are you absolutely sure? This will permanently delete your account and all of its data. This action cannot be undone.'
                }
                confirmText={confirmAction === 'reset' ? 'Yes, Reset My Progress' : 'Yes, Delete My Account'}
            />
        </>
    );
};

export default ProfileView;
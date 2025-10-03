import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';
import { AVATARS } from './Avatars';
import { ArrowLeft, Trophy, Flame, BookOpen, Spinner } from './Icons';

interface LeaderboardEntry {
    id: string;
    name: string;
    avatar: string;
    streak: number;
    completed_lessons: string[];
}

interface LeaderboardViewProps {
    user: UserProfile;
    onBack: () => void;
    onViewProfile: (userId: string) => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user, onBack, onViewProfile }) => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase
                .from('profiles')
                .select('id, name, avatar, streak, completed_lessons')
                .order('streak', { ascending: false })
                .order('completed_lessons', { ascending: false, nullsFirst: false })
                .limit(25);

            if (error) {
                console.error("Error fetching leaderboard:", error);
                setError("Could not load the leaderboard. This might be due to database permissions (RLS). Please check the console for details.");
            } else {
                const processedData = data.sort((a, b) => {
                    if (b.streak !== a.streak) {
                        return b.streak - a.streak;
                    }
                    return (b.completed_lessons?.length || 0) - (a.completed_lessons?.length || 0);
                });
                setLeaderboardData(processedData);
            }
            setLoading(false);
        };
        fetchLeaderboard();
    }, []);

    const renderRankIcon = (rank: number) => {
        if (rank === 1) return <span className="text-yellow-400 text-2xl" role="img" aria-label="1st place">🥇</span>;
        if (rank === 2) return <span className="text-slate-400 text-2xl" role="img" aria-label="2nd place">🥈</span>;
        if (rank === 3) return <span className="text-amber-600 text-2xl" role="img" aria-label="3rd place">🥉</span>;
        return <span className="font-bold text-slate-500 dark:text-slate-400 w-8 text-center text-lg">{rank}</span>;
    };
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md border dark:border-slate-700">
                <button onClick={onBack} className="absolute top-4 left-4 flex items-center space-x-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 font-semibold transition-colors">
                    <ArrowLeft className="text-lg" />
                    <span>Dashboard</span>
                </button>
                <div className="text-center pt-10">
                    <Trophy className="text-6xl text-purple-600 dark:text-purple-400 mx-auto" />
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2">ChemCat Champions</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">See who's at the top of their chemistry game!</p>
                </div>
                
                <div className="mt-8 space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
                            <Spinner className="text-4xl text-purple-500" />
                            <p className="text-slate-500 dark:text-slate-400 mt-4">Fetching the champions list...</p>
                        </div>
                    ) : error ? (
                         <div className="text-center p-8 min-h-[200px] bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <p className="font-bold text-red-700 dark:text-red-300">An Error Occurred</p>
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                        </div>
                    ) : leaderboardData && leaderboardData.length > 0 ? (
                        leaderboardData.map((entry, index) => {
                            const isCurrentUser = entry.id === user.id;
                            const AvatarComponent = AVATARS[entry.avatar] || AVATARS['avatar1'];
                            const rank = index + 1;
                            
                            return (
                                <button
                                    key={entry.id}
                                    onClick={() => onViewProfile(entry.id)}
                                    className={`w-full flex items-center p-3 rounded-xl transition-colors border-2 ${isCurrentUser ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400' : 'bg-slate-50 dark:bg-slate-700/50 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    <div className="flex-shrink-0 w-10 text-center">{renderRankIcon(rank)}</div>
                                    <div className="flex items-center space-x-3 flex-grow mx-4">
                                        <AvatarComponent className="w-12 h-12" />
                                        <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{entry.name}</span>
                                        {isCurrentUser && <span className="text-xs font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">YOU</span>}
                                    </div>
                                    <div className="flex items-center space-x-6 text-sm font-semibold">
                                        <div className="flex items-center space-x-1.5 text-orange-600 dark:text-orange-400 w-16" title="Streak">
                                            <Flame className="text-lg" />
                                            <span>{entry.streak}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 text-green-600 dark:text-green-400 w-16" title="Lessons Completed">
                                            <BookOpen className="text-lg" />
                                            <span>{entry.completed_lessons?.length || 0}</span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })
                    ) : (
                        <div className="text-center p-8 min-h-[200px]">
                            <p className="text-slate-500 dark:text-slate-400">The leaderboard is empty. Be the first to complete a lesson!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardView;
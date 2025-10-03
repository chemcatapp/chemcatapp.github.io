
import React, { useState, useEffect } from 'react';
import { Flame } from './Icons';

interface LessonCompleteViewProps {
    summary: {
        xpEarned: number;
        oldStreak: number;
        newStreak: number;
    };
    onContinue: () => void;
}

const LessonCompleteView: React.FC<LessonCompleteViewProps> = ({ summary, onContinue }) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 300),   // Show title
            setTimeout(() => setStage(2), 1000),  // Show Rewards list
            setTimeout(() => setStage(3), 1800),  // Show Streak
            setTimeout(() => setStage(4), 2500),  // Show Button
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const wasStreakExtended = summary.newStreak > summary.oldStreak && summary.newStreak > 1;
    const isNewStreak = summary.newStreak === 1 && summary.oldStreak === 0;

    return (
        <div className="fixed inset-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-md text-center">
                <div className={`transition-all duration-500 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 dark:text-purple-400">
                        Lesson Complete!
                    </h1>
                </div>

                <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mt-8 border dark:border-slate-700 transition-all duration-500 delay-200 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        <div className={`flex justify-between items-center py-4 transition-all duration-500 ${stage >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            <span className="text-lg font-bold text-slate-700 dark:text-slate-200">Energy Earned</span>
                            <span className="text-lg font-bold text-blue-500">+{summary.xpEarned} ✨</span>
                        </div>
                        <div className={`flex justify-between items-center py-4 transition-all duration-500 delay-200 ${stage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            <span className="text-lg font-bold text-slate-700 dark:text-slate-200">Streak</span>
                            <div className={`flex items-center space-x-2 transition-transform duration-300 ${(wasStreakExtended || isNewStreak) ? 'animate-pulse-correct' : ''}`}>
                                 <Flame className={`text-2xl transition-colors duration-500 ${summary.newStreak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                                 <span className="text-lg font-bold text-orange-500">{summary.newStreak} Day{summary.newStreak !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                     {(wasStreakExtended || isNewStreak) && (
                        <p className={`text-sm font-semibold mt-4 transition-opacity duration-500 delay-500 ${stage >= 3 ? 'opacity-100' : 'opacity-0'} ${summary.newStreak > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400'}`}>
                           {wasStreakExtended ? 'Streak Extended!' : 'Streak Started! Keep it going!'}
                        </p>
                     )}
                </div>

                 <div className={`mt-8 transition-all duration-500 delay-500 ${stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <button
                        onClick={onContinue}
                        className="w-full bg-purple-500 text-white font-bold py-4 rounded-xl hover:bg-purple-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonCompleteView;

import React from 'react';
import { Badge } from '../types';

interface BadgeUnlockedModalProps {
    badge: Badge;
    onClose: () => void;
}

const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({ badge, onClose }) => {
    const BadgeIcon = badge.icon;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-8 relative animate-fade-in-up text-center">
                <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-2">Badge Unlocked!</h2>
                <div className="flex justify-center my-4">
                    <BadgeIcon className="text-8xl text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{badge.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 my-4">{badge.description}</p>
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
};

export default BadgeUnlockedModal;
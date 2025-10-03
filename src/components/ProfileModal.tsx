import React, { useState } from 'react';
import { UserProfile, ThemeColor } from '../types';
import { XCircle } from './Icons';
import { AVATARS } from './Avatars';
import { CURRICULA } from '../curriculum';

interface ProfileModalProps {
    user: UserProfile;
    onSave: (newUser: UserProfile) => void;
    onClose: () => void;
}

const THEME_COLORS: { name: ThemeColor, class: string }[] = [
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'green', class: 'bg-green-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'pink', class: 'bg-pink-500' },
];

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
    const [selectedTheme, setSelectedTheme] = useState(user.themeColor);
    const [dailyGoal, setDailyGoal] = useState(user.dailyGoal || 50);
    const [focusedSubjects, setFocusedSubjects] = useState(user.focusedSubjects || ['chemistry']);

    const handleSave = () => {
        if (name.trim() && username.trim() && email.trim()) {
            onSave({ ...user, name: name.trim(), username, email, avatar: selectedAvatar, themeColor: selectedTheme, dailyGoal, focusedSubjects });
        }
    };

    const handleSubjectToggle = (subjectKey: string) => {
        setFocusedSubjects(prev => {
            const isSelected = prev.includes(subjectKey);
            if (isSelected) {
                // Prevent unselecting the last subject
                return prev.length > 1 ? prev.filter(s => s !== subjectKey) : prev;
            } else {
                return [...prev, subjectKey];
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <XCircle className="text-3xl" />
                </button>
                <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-6 text-center">Your Settings</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Display Name</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all" />
                            </div>
                             <div>
                                 <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Choose your ChemCat!</label>
                                 <div className="grid grid-cols-4 gap-4">
                                    {Object.entries(AVATARS).map(([key, AvatarComponent]) => (
                                        <button key={key} onClick={() => setSelectedAvatar(key)} className={`p-2 rounded-full transition-all duration-200 ${selectedAvatar === key ? 'ring-4 ring-purple-500 dark:ring-purple-400' : 'ring-2 ring-transparent hover:ring-purple-300'}`}>
                                            <AvatarComponent className="w-full h-full" />
                                        </button>
                                    ))}
                                 </div>
                            </div>
                            <div>
                                 <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Profile Theme</label>
                                 <div className="flex space-x-3">
                                    {THEME_COLORS.map((theme) => (
                                        <button key={theme.name} onClick={() => setSelectedTheme(theme.name)} className={`w-10 h-10 rounded-full transition-all duration-200 ${theme.class} ${selectedTheme === theme.name ? 'ring-4 ring-offset-2 ring-slate-800 dark:ring-slate-200' : 'hover:scale-110'}`} />
                                    ))}
                                 </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t dark:border-slate-600">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Account</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Username</label>
                                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">3-15 characters, letters, numbers, underscores only.</p>
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Email Address</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all" />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You will need to verify your new email address.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t dark:border-slate-600">
                         <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Learning Goals</h3>
                         <div className="space-y-6">
                             <div>
                                <label htmlFor="dailyGoal" className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                                    <span>Daily XP Goal</span>
                                    <span className="font-extrabold text-purple-600 dark:text-purple-400">{dailyGoal} XP</span>
                                </label>
                                <input
                                    id="dailyGoal"
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="10"
                                    value={dailyGoal}
                                    onChange={(e) => setDailyGoal(parseInt(e.target.value, 10))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Focused Subjects</label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(CURRICULA).map(([key, { name }]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleSubjectToggle(key)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors border-2 ${focusedSubjects.includes(key) ? 'bg-purple-500 border-purple-500 text-white' : 'bg-transparent border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-500'}`}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="w-full sm:w-auto px-8 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors disabled:bg-slate-300"
                        disabled={!name.trim()}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
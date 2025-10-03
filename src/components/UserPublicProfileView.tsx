import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';
import { AVATARS } from './Avatars';
import { ArrowLeft, Flame, BookOpen, Spinner } from './Icons';

interface ProfileData {
    name: string;
    username: string;
    avatar: string;
    streak: number;
    completed_lessons: string[];
}

interface UserPublicProfileViewProps {
    viewingUserId: string;
    currentUser: UserProfile;
    onBack: () => void;
}

const UserPublicProfileView: React.FC<UserPublicProfileViewProps> = ({ viewingUserId, currentUser, onBack }) => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (viewingUserId === currentUser.id) {
             // Redirect to own profile view if viewing self, handled by App's view logic
             // For now, just show a simplified view or handle in App.tsx
             onBack();
             return;
        }

        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('name, username, avatar, streak, completed_lessons')
                .eq('id', viewingUserId)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
                setError("Could not load this user's profile.");
                setLoading(false);
                return;
            }
            
            setProfile(profileData);

            const { data: followData, error: followError } = await supabase
                .from('follows')
                .select('*')
                .eq('follower_id', currentUser.id)
                .eq('followed_id', viewingUserId)
                .maybeSingle();

            if (followError) {
                console.error("Error checking follow status:", followError);
            } else {
                setIsFollowing(!!followData);
            }

            setLoading(false);
        };

        if (viewingUserId) {
            fetchProfileData();
        }
    }, [viewingUserId, currentUser.id, onBack]);

    const handleFollowToggle = async () => {
        if (isFollowing) {
            // Unfollow logic
            setIsFollowing(false);
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', currentUser.id)
                .eq('followed_id', viewingUserId);
            if (error) {
                console.error("Error unfollowing user:", error);
                setIsFollowing(true); // Revert on error
            }
        } else {
            // Follow logic
            setIsFollowing(true);
            const { error } = await supabase
                .from('follows')
                .insert({ follower_id: currentUser.id, followed_id: viewingUserId });
            if (error) {
                console.error("Error following user:", error);
                setIsFollowing(false); // Revert on error
            }
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
                <Spinner className="text-4xl text-purple-500" />
                <p className="text-slate-500 dark:text-slate-400 mt-4">Loading profile...</p>
            </div>
        );
    }
    
    if (error || !profile) {
        return (
            <div className="text-center p-8 min-h-[400px] bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="font-bold text-red-700 dark:text-red-300">An Error Occurred</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error || "Profile not found."}</p>
                 <button onClick={onBack} className="mt-6 px-6 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg font-semibold">
                    Back
                </button>
            </div>
        );
    }
    
    const AvatarComponent = AVATARS[profile.avatar] || AVATARS['avatar1'];

    return (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="relative p-4 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md border dark:border-slate-700">
                <button onClick={onBack} className="absolute top-4 left-4 flex items-center space-x-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 font-semibold transition-colors">
                    <ArrowLeft className="text-lg" />
                    <span>Back</span>
                </button>
                <div className="flex flex-col items-center pt-12">
                     <AvatarComponent className="w-32 h-32" />
                     <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-400 mt-4">{profile.name}</h1>
                     <p className="text-slate-500 dark:text-slate-400 text-lg">@{profile.username}</p>
                    
                    <div className="mt-8 flex items-center space-x-8">
                        <div className="text-center">
                            <Flame className="text-4xl text-orange-500 mx-auto" />
                            <p className="text-3xl font-bold mt-1">{profile.streak}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Day Streak</p>
                        </div>
                        <div className="text-center">
                             <BookOpen className="text-4xl text-green-600 mx-auto" />
                            <p className="text-3xl font-bold mt-1">{profile.completed_lessons?.length || 0}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Lessons Done</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 w-full max-w-xs">
                        <button onClick={handleFollowToggle} className={`w-full px-8 py-3 font-bold rounded-lg transition-colors ${
                            isFollowing
                            ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPublicProfileView;
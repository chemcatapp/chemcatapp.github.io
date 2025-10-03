
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';
import { AVATARS } from './Avatars';
import { ArrowLeft, Spinner, BookOpen, Trophy, Search, UserPlus, UserCheck, XCircle } from './Icons';
import { debounce } from 'lodash';

const InviteFriendModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const inviteLink = window.location.origin;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me on ChemCat!',
                text: 'Learn chemistry in a fun, new way with ChemCat. Come join me!',
                url: inviteLink,
            }).catch((error) => console.log('Error sharing:', error));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-8 relative animate-fade-in-up text-center">
                 <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <XCircle className="text-3xl" />
                </button>
                <div className="text-5xl">💌</div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">Invite a Friend</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Share this link with your friends to invite them to ChemCat!</p>
                <div className="flex items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-lg border-2 dark:border-slate-600">
                    <input type="text" readOnly value={inviteLink} className="bg-transparent w-full outline-none text-slate-600 dark:text-slate-300" />
                    <button onClick={handleCopy} className="px-3 py-1 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition-colors w-24 flex-shrink-0">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                 {navigator.share && (
                     <button onClick={handleShare} className="w-full mt-4 px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                        Share
                    </button>
                 )}
            </div>
        </div>
    );
};


interface Activity {
    id: string;
    created_at: string;
    type: 'LESSON_COMPLETE' | 'BADGE_EARNED';
    metadata: {
        userName: string;
        lessonTitle?: string;
        badgeName?: string;
    };
    user_id: string;
    profiles: {
        avatar: string;
    }
}

interface SearchResultProfile {
    id: string;
    name: string;
    avatar: string;
}

interface FriendsViewProps {
    user: UserProfile;
    onBack: () => void;
    onViewProfile: (userId: string) => void;
}

const ActivityCard: React.FC<{ activity: Activity, onViewProfile: (userId: string) => void }> = ({ activity, onViewProfile }) => {
    const AvatarComponent = AVATARS[activity.profiles.avatar] || AVATARS['avatar1'];
    const timeAgo = new Date(activity.created_at).toLocaleString(undefined, {
        day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'
    });

    let message;
    let Icon = BookOpen;
    let iconColor = "text-green-500";
    switch(activity.type) {
        case 'LESSON_COMPLETE':
            message = <>completed the lesson <strong>{activity.metadata.lessonTitle}</strong></>;
            break;
        case 'BADGE_EARNED':
            message = <>earned the <strong>{activity.metadata.badgeName}</strong> badge!</>;
            Icon = Trophy;
            iconColor = "text-yellow-500";
            break;
        default:
            message = <>did something cool.</>;
    }

    return (
        <div className="bg-white dark:bg-slate-700/50 p-4 rounded-xl shadow-sm border dark:border-slate-600 flex space-x-4">
            <div className="flex-shrink-0">
                <Icon className={`text-2xl mt-1 ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                    <button onClick={() => onViewProfile(activity.user_id)} className="font-bold hover:underline">{activity.metadata.userName}</button> {message}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo}</p>
            </div>
            <button onClick={() => onViewProfile(activity.user_id)} className="ml-auto flex-shrink-0">
                <AvatarComponent className="w-10 h-10" />
            </button>
        </div>
    );
};


const FriendsView: React.FC<FriendsViewProps> = ({ user, onBack, onViewProfile }) => {
    const [activityFeed, setActivityFeed] = useState<Activity[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<React.ReactNode | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultProfile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const fetchFollowsAndFeed = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const { data: follows, error: followsError } = await supabase
            .from('follows')
            .select('followed_id')
            .eq('follower_id', user.id);

        if (followsError) {
            console.error("Error fetching follows:", followsError);
            setError(
                <>
                    <p>Could not load your friends' activity.</p>
                    <p className="text-sm mt-2">This is often caused by a missing database setup. Please make sure you have run the setup script mentioned in the <strong>readme.md</strong> file to create the necessary tables and policies.</p>
                </>
            );
            setLoading(false);
            return;
        }
        // FIX: Explicitly typed the `Set` constructor with `<string>` to prevent TypeScript from inferring `Set<unknown>` when the initial array is empty. This resolves the type error when updating the `followedIds` state.
        const currentFollowedIds = new Set<string>(follows?.map(f => String(f.followed_id)) || []);
        setFollowedIds(currentFollowedIds);

        if (currentFollowedIds.size === 0) {
            setActivityFeed([]);
            setLoading(false);
            return;
        }

        const { data, error: activityError } = await supabase
            .from('activity')
            .select('*, profiles (avatar)')
            .in('user_id', Array.from(currentFollowedIds))
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (activityError) {
            console.error("Error fetching activity feed:", activityError);
            setError("Could not load your friends' activity.");
        } else {
            setActivityFeed(data as Activity[]);
        }
        
        setLoading(false);
    }, [user.id]);

    useEffect(() => {
        fetchFollowsAndFeed();
    }, [fetchFollowsAndFeed]);

    const debouncedSearch = useCallback(debounce(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, avatar')
            .ilike('name', `%${query}%`)
            .neq('id', user.id)
            .limit(5);
        
        if (error) {
            console.error("Error searching profiles:", error);
        } else {
            setSearchResults(data as SearchResultProfile[]);
        }
        setIsSearching(false);
    }, 500), [user.id]);

    useEffect(() => {
        setIsSearching(true);
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
        if (isCurrentlyFollowing) {
            const { error } = await supabase.from('follows').delete().match({ follower_id: user.id, followed_id: targetUserId });
            if (!error) {
                setFollowedIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(targetUserId);
                    return newSet;
                });
                // Optimistically remove from feed
                setActivityFeed(prev => prev?.filter(a => a.user_id !== targetUserId) || []);
            }
        } else {
            const { error } = await supabase.from('follows').insert({ follower_id: user.id, followed_id: targetUserId });
            if (!error) {
                setFollowedIds(prev => new Set(prev).add(targetUserId));
                // We don't add to feed here, it will show up on next full load if they have activity
            }
        }
    };

    return (
        <>
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md border dark:border-slate-700">
                <div className="flex justify-between items-start">
                    <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 font-semibold transition-colors">
                        <ArrowLeft className="text-lg" />
                        <span>Dashboard</span>
                    </button>
                    <button onClick={() => setIsInviteModalOpen(true)} className="px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-bold rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors text-sm">
                        Invite a Friend
                    </button>
                </div>

                <div className="text-center pt-4">
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2">Friends Activity</h1>
                </div>

                <div className="mt-8 space-y-8">
                    <div>
                        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Find Friends</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name..."
                                className="w-full p-3 pl-10 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                            />
                            {isSearching && searchQuery.length > 1 && <Spinner className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500" />}
                        </div>
                        {searchResults.length > 0 && (
                             <div className="mt-4 space-y-2 stagger-in">
                                {searchResults.map((result, index) => {
                                    const Avatar = AVATARS[result.avatar] || AVATARS.avatar1;
                                    const isFollowing = followedIds.has(result.id);
                                    return (
                                        <div key={result.id} style={{ animationDelay: `${index * 100}ms` }} className="flex items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <button onClick={() => onViewProfile(result.id)} className="flex items-center space-x-3 flex-grow hover:opacity-80 transition-opacity">
                                                <Avatar className="w-10 h-10" />
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{result.name}</span>
                                            </button>
                                            <button onClick={() => handleFollowToggle(result.id, isFollowing)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center space-x-1.5 transition-colors ${isFollowing ? 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                                                {isFollowing ? <UserCheck /> : <UserPlus />}
                                                <span>{isFollowing ? 'Following' : 'Follow'}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    <div>
                         <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Activity Feed</h2>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
                                    <Spinner className="text-4xl text-purple-500" />
                                    <p className="text-slate-500 dark:text-slate-400 mt-4">Loading your feed...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center p-6 min-h-[200px] bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-700/50">
                                    <p className="font-bold text-red-700 dark:text-red-300">An Error Occurred</p>
                                    <div className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</div>
                                </div>
                            ) : activityFeed && activityFeed.length > 0 ? (
                                activityFeed.map(activity => (
                                <ActivityCard key={activity.id} activity={activity} onViewProfile={onViewProfile} />
                                ))
                            ) : (
                                <div className="text-center p-8 min-h-[200px] border-2 border-dashed rounded-lg">
                                    <p className="font-semibold text-slate-600 dark:text-slate-300">It's quiet in here...</p>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Follow other students to see their progress here!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {isInviteModalOpen && <InviteFriendModal onClose={() => setIsInviteModalOpen(false)} />}
        </>
    );
};

export default FriendsView;

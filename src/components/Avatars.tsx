import React from 'react';

type AvatarProps = { className?: string };

const Avatar1: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-pink-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">😺</div>
    </div>
);
const Avatar2: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-blue-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">😸</div>
    </div>
);
const Avatar3: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-green-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">😹</div>
    </div>
);
const Avatar4: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-yellow-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">😻</div>
    </div>
);
const Avatar5: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-purple-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">😼</div>
    </div>
);
const Avatar6: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-orange-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">😽</div>
    </div>
);
const Avatar7: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-red-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">🙀</div>
    </div>
);
const Avatar8: React.FC<AvatarProps> = ({ className }) => (
    <div className={`${className} bg-teal-200 rounded-full p-1 flex items-center justify-center`}>
        <div className="text-4xl">😿</div>
    </div>
);

export const AVATARS: { [key: string]: React.FC<AvatarProps> } = {
    avatar1: Avatar1,
    avatar2: Avatar2,
    avatar3: Avatar3,
    avatar4: Avatar4,
    avatar5: Avatar5,
    avatar6: Avatar6,
    avatar7: Avatar7,
    avatar8: Avatar8,
};
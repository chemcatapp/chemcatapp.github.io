

import React from 'react';

type IconProps = { className?: string };

// Using <i> tags for Bootstrap Icons. Sizing is controlled by font-size (e.g., text-xl).
export const Lock: React.FC<IconProps> = ({ className }) => <i className={`bi bi-lock-fill ${className}`}></i>;
export const CheckCircle: React.FC<IconProps> = ({ className }) => <i className={`bi bi-check-circle-fill ${className}`}></i>;
export const PlayCircle: React.FC<IconProps> = ({ className }) => <i className={`bi bi-play-circle-fill ${className}`}></i>;
export const XCircle: React.FC<IconProps> = ({ className }) => <i className={`bi bi-x-circle-fill ${className}`}></i>;
export const ArrowLeft: React.FC<IconProps> = ({ className }) => <i className={`bi bi-arrow-left ${className}`}></i>;
export const ArrowRight: React.FC<IconProps> = ({ className }) => <i className={`bi bi-arrow-right ${className}`}></i>;
export const Lightbulb: React.FC<IconProps> = ({ className }) => <i className={`bi bi-lightbulb-fill ${className}`}></i>;
export const Beaker: React.FC<IconProps> = ({ className }) => <i className={`bi bi-beaker ${className}`}></i>;
export const ImageIcon: React.FC<IconProps> = ({ className }) => <i className={`bi bi-image ${className}`}></i>;
export const Spinner: React.FC<IconProps> = ({ className }) => <i className={`bi bi-arrow-repeat animate-spin ${className}`}></i>;
export const Refresh: React.FC<IconProps> = ({ className }) => <i className={`bi bi-arrow-clockwise ${className}`}></i>;
export const Flame: React.FC<IconProps> = ({ className }) => <i className={`bi bi-fire ${className}`}></i>;
export const Cog: React.FC<IconProps> = ({ className }) => <i className={`bi bi-gear-fill ${className}`}></i>;
export const BookOpen: React.FC<IconProps> = ({ className }) => <i className={`bi bi-book-fill ${className}`}></i>;
export const ChartPie: React.FC<IconProps> = ({ className }) => <i className={`bi bi-pie-chart-fill ${className}`}></i>;
export const ShieldCheck: React.FC<IconProps> = ({ className }) => <i className={`bi bi-shield-check ${className}`}></i>;
export const Award: React.FC<IconProps> = ({ className }) => <i className={`bi bi-award-fill ${className}`}></i>;
export const Trophy: React.FC<IconProps> = ({ className }) => <i className={`bi bi-trophy-fill ${className}`}></i>;
export const Sun: React.FC<IconProps> = ({ className }) => <i className={`bi bi-sun-fill ${className}`}></i>;
export const Moon: React.FC<IconProps> = ({ className }) => <i className={`bi bi-moon-stars-fill ${className}`}></i>;
export const People: React.FC<IconProps> = ({ className }) => <i className={`bi bi-people-fill ${className}`}></i>;
export const Search: React.FC<IconProps> = ({ className }) => <i className={`bi bi-search ${className}`}></i>;
export const UserPlus: React.FC<IconProps> = ({ className }) => <i className={`bi bi-person-plus-fill ${className}`}></i>;
export const UserCheck: React.FC<IconProps> = ({ className }) => <i className={`bi bi-person-check-fill ${className}`}></i>;
// FIX: Added missing export for the ChatDots icon.
export const ChatDots: React.FC<IconProps> = ({ className }) => <i className={`bi bi-chat-dots-fill ${className}`}></i>;


// Keeping these as SVGs because they are custom and more complex.
export const AtomIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none">
        <circle cx="50" cy="50" r="6" strokeWidth="3" fill="currentColor" />
        <ellipse cx="50" cy="50" rx="40" ry="15" strokeWidth="3" />
        <ellipse cx="50" cy="50" rx="40" ry="15" strokeWidth="3" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="40" ry="15" strokeWidth="3" transform="rotate(120 50 50)" />
    </svg>
);

export const MoleculeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor">
        <circle cx="25" cy="35" r="8" />
        <circle cx="50" cy="65" r="12" />
        <circle cx="75" cy="35" r="8" />
        <path d="M 30 39 L 45 58" strokeWidth="5" fill="none" />
        <path d="M 70 39 L 55 58" strokeWidth="5" fill="none" />
    </svg>
);
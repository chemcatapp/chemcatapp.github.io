import { Badge } from './types';
import { Award, Trophy } from './components/Icons';

export const BADGES: Badge[] = [
    {
        id: 'streak7',
        name: 'Weekly Whiz',
        description: "Maintained a 7-day streak. That's dedication!",
        icon: Award,
        streakRequirement: 7,
    },
    {
        id: 'streak30',
        name: 'Monthly Master',
        description: "Kept a 30-day streak going. You're a chemistry champion!",
        icon: Trophy,
        streakRequirement: 30,
    }
];
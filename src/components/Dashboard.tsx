

import React from 'react';
import { Unit, Progress, Lesson } from '../types';
import { Lock, CheckCircle, PlayCircle, Flame, XCircle, BookOpen, ChartPie, Refresh, Lightbulb } from './Icons';

interface DashboardProps {
  units: Unit[];
  progress: Progress;
  onStartLesson: (lesson: Lesson) => void;
  onStartUnitPractice: (unit: Unit) => void;
  isLessonUnlocked: (lessonId: string) => boolean;
  notification?: string | null;
  onDismissNotification: () => void;
  curricula: { [key: string]: { name: string; units: Unit[] } };
  onStartStrengthenSkills: () => void;
}

const NotificationBar: React.FC<{ message: string, onDismiss: () => void }> = ({ message, onDismiss }) => (
    <div className="bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 px-4 py-3 rounded-2xl relative flex items-center justify-between animate-fade-in" role="alert">
        <div className="flex items-center">
            <strong className="font-bold mr-2">Hey!</strong>
            <span className="block sm:inline">{message}</span>
        </div>
        <button onClick={onDismiss} className="p-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
            <XCircle className="text-xl" />
        </button>
    </div>
);

const ChemCatSays: React.FC<{ streak: number }> = ({ streak }) => {
  let message = "";
  if (streak === 0) {
    message = "First lesson's waiting. You wouldn't want to see what happens when I get bored, would you?";
  } else if (streak > 0 && streak < 5) {
    message = `A ${streak}-day streak is a good start. Keep it up, or your WiFi password might mysteriously change.`;
  } else if (streak >= 5 && streak < 10) {
    message = `${streak} days... impressive. I guess I don't have to 'accidentally' unsubscribe you from your favorite channels. For now.`;
  } else {
    message = `WOW! ${streak} days! You're on a roll! Maybe I don't need to sign you up for daily cat facts after all. Keep going!`;
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex items-center space-x-6 border-2 border-purple-200 dark:border-purple-900 h-full">
      <div className="flex-shrink-0">
        <div className="text-6xl">🧪</div>
        <div className="text-7xl -mt-8 ml-4">😺</div>
      </div>
      <div>
        <h3 className="font-bold text-purple-700 dark:text-purple-400 text-xl">A sponsored message from ChemCat:</h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{message}</p>
      </div>
    </div>
  );
};

const StreakTracker: React.FC<{ streak: number }> = ({ streak }) => {
  const flameColor = streak > 0 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500';
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-full border-2 border-orange-200 dark:border-orange-900">
      <div className="flex items-center justify-center">
        <Flame className={`${flameColor} text-7xl transition-colors duration-500`} />
        <div className="ml-4 text-left">
            <p className="text-6xl font-extrabold text-slate-700 dark:text-slate-200">{streak}</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400 -mt-2">Day Streak</p>
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm">
        {streak > 0 ? `You're on a roll! Keep the fire going!` : "Complete a lesson today to start your streak!"}
      </p>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white/50 dark:bg-slate-700/50 p-4 rounded-xl shadow-sm flex items-center space-x-4 border dark:border-slate-600 backdrop-blur-sm">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ units, progress, onStartLesson, onStartUnitPractice, isLessonUnlocked, notification, onDismissNotification, curricula, onStartStrengthenSkills }) => {
  const totalLessonsCompleted = progress.completedLessons.length;
  
  const allLessons = Object.values(curricula).flatMap((c: { units: Unit[] }) => c.units.flatMap(u => u.lessons));
  const totalLessonsAvailable = allLessons.length;
  const overallCompletion = totalLessonsAvailable > 0 ? Math.round((totalLessonsCompleted / totalLessonsAvailable) * 100) : 0;
  
  const allUnits = Object.values(curricula).flatMap((c: { units: Unit[] }) => c.units);
  const unitsStarted = allUnits.filter(unit => 
      unit.lessons.length > 0 && unit.lessons.some(lesson => progress.completedLessons.includes(lesson.id))
  ).length;

  const hasWeakTopics = progress.weakTopics && progress.weakTopics.length > 0;

  return (
    <div className="space-y-8">
      {notification && <NotificationBar message={notification} onDismiss={onDismissNotification} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <ChemCatSays streak={progress.streak} />
        </div>
        <StreakTracker streak={progress.streak} />
      </div>

       <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Strengthen Your Weakest Links</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {hasWeakTopics 
                    ? `ChemCat has identified ${progress.weakTopics.length} topic(s) you could improve on. Start a personalized practice session to master them!`
                    : "No weak spots found yet! Keep practicing to identify areas where you can grow."
                }
            </p>
        </div>
        <button 
            onClick={onStartStrengthenSkills}
            disabled={!hasWeakTopics}
            className="w-full md:w-auto flex-shrink-0 flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed"
        >
            <Lightbulb className="text-xl"/>
            <span>Start Review</span>
        </button>
      </div>

      {units.map((unit) => {
        const completedInUnit = unit.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
        const totalInUnit = unit.lessons.length;
        const unitProgress = totalInUnit > 0 ? (completedInUnit / totalInUnit) * 100 : 100;
        const isUnitComplete = totalInUnit > 0 && completedInUnit === totalInUnit;

        return (
          <div key={unit.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
                <h2 className={`text-2xl font-bold ${unit.color} ${unit.darkColor}`}>{unit.title}</h2>
                {isUnitComplete && (
                    <button 
                        onClick={() => onStartUnitPractice(unit)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-all transform hover:scale-105"
                    >
                        <Refresh className="text-lg"/>
                        <span>Unit Review</span>
                    </button>
                )}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
                <div className={`${unit.bgColor.replace('bg-','bg-')} ${unit.darkBgColor?.replace('dark:bg-','dark:bg-')} h-4 rounded-full transition-all duration-500 ${isUnitComplete ? 'animate-glow' : ''}`} style={{ width: `${unitProgress}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unit.lessons.map((lesson) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const isUnlocked = isLessonUnlocked(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => isUnlocked && onStartLesson(lesson)}
                    disabled={!isUnlocked}
                    className={`p-4 rounded-lg text-center font-bold transition-all duration-200 flex flex-col items-center justify-center space-y-2 aspect-square
                      ${isCompleted ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : ''}
                      ${!isUnlocked ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' : ''}
                      ${isUnlocked && !isCompleted ? `${unit.bgColor} ${unit.color} ${unit.darkBgColor} ${unit.darkColor} hover:ring-2 hover:ring-purple-400 dark:hover:ring-purple-500 transform hover:scale-105` : ''}
                      ${isUnlocked && isCompleted ? 'opacity-70 hover:ring-2 hover:ring-green-400 dark:hover:ring-green-500 transform hover:scale-105' : ''}
                    `}
                  >
                    {isCompleted ? <CheckCircle className="text-3xl"/> : (isUnlocked ? <PlayCircle className="text-3xl"/> : <Lock className="text-3xl"/>)}
                    <span className="text-sm">{lesson.title}</span>
                  </button>
                );
              })}
              {unit.lessons.length === 0 && <p className="text-slate-500 dark:text-slate-400 italic col-span-full">Lessons coming soon!</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
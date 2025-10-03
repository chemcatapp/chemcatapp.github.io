
import React, { useState, useEffect } from 'react';
import { PracticeQuestion } from '../types';
import { CheckCircle, XCircle, Refresh } from './Icons';

// Confirmation Modal Component
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const PRACTICE_EXIT_MESSAGES = [
    "Quitting now? The elements are judging you. Silently.",
    "Sure, exit. But remember, for every unsolved problem, a beaker cries.",
    "Trying to escape? You can't escape the second law of thermodynamics. Or me.",
    "Don't let entropy win! Finish your practice.",
    "Are you a noble gas? Because you seem resistant to bonding... with this practice session."
];

// Levenshtein distance function for typo detection
const levenshtein = (a: string, b: string): number => {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    matrix[i] = [i];
  }
  const bMatrix = matrix[0];
  for (let j = 1; j <= an; ++j) {
    bMatrix[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Yes, Exit', cancelText = 'No, Stay' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-8 relative animate-fade-in-up text-center">
                <div className="text-6xl mb-4">😿</div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
                
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                        {cancelText}
                    </button>
                     <button 
                        onClick={onConfirm}
                        className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PracticeViewProps {
  questions: PracticeQuestion[];
  onComplete: () => void;
  onBack: () => void;
  unitBgColor: string;
  practiceTitle: string;
  onQuestionIncorrect: (explanation: string) => void;
}

const PracticeView: React.FC<PracticeViewProps> = ({ questions, onComplete, onBack, unitBgColor, practiceTitle, onQuestionIncorrect }) => {
  const [practiceSet, setPracticeSet] = useState<PracticeQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wronglyAnsweredQuestions, setWronglyAnsweredQuestions] = useState<PracticeQuestion[]>([]);
  const [view, setView] = useState<'practicing' | 'summary'>('practicing');
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [exitMessage, setExitMessage] = useState('');

  useEffect(() => {
    setPracticeSet(questions);
    setCurrentIndex(0);
    setAnswers({});
    setIsAnswered(false);
    setWronglyAnsweredQuestions([]);
    setView('practicing');
  }, [questions]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const currentQuestion = practiceSet[currentIndex];

  const calculateIsCorrect = (): boolean => {
    // FIX: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value. Implemented answer checking logic.
    const userAnswer = answers[currentIndex];
    const correctAnswer = currentQuestion.answer;
    
    if (!userAnswer) return false;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return typeof userAnswer === 'string' && userAnswer.toLowerCase() === correctAnswer[0].toLowerCase();

      case 'fill-in-the-blank': {
        if (typeof userAnswer !== 'string') return false;
        const userAnswerTrimmed = userAnswer.toLowerCase().trim();
        const allPossibleAnswers = [correctAnswer[0], ...(currentQuestion.alternatives || [])].map(a => a.toLowerCase());
        
        // Check for exact match first
        if (allPossibleAnswers.includes(userAnswerTrimmed)) return true;
        
        // Check for typos using Levenshtein distance
        const typoThreshold = Math.max(1, Math.floor(correctAnswer[0].length / 5)); // Allow more typos for longer words
        for (const possibleAnswer of allPossibleAnswers) {
            if (levenshtein(userAnswerTrimmed, possibleAnswer) <= typoThreshold) {
                return true;
            }
        }

        return false;
      }

      case 'select-all-that-apply': {
        if (!Array.isArray(userAnswer)) return false;
        if (userAnswer.length !== correctAnswer.length) return false;
        
        const sortedUserAnswer = [...userAnswer].sort();
        const sortedCorrectAnswer = [...correctAnswer].sort();
        
        return sortedUserAnswer.every((val, index) => val === sortedCorrectAnswer[index]);
      }

      default:
        return false;
    }
  };
  
  const isCorrect = isAnswered ? calculateIsCorrect() : false;
  const userAnswer = answers[currentIndex];
  const isAnswerEmpty = !userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0);

  const handleOpenExitModal = () => {
        const randomIndex = Math.floor(Math.random() * PRACTICE_EXIT_MESSAGES.length);
        setExitMessage(PRACTICE_EXIT_MESSAGES[randomIndex]);
        setIsExitModalOpen(true);
  };

  const handleAnswerChange = (answer: string) => {
    if (isAnswered) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
  };

  const handleSataChange = (option: string) => {
    if (isAnswered) return;
    setAnswers(prev => {
        const currentAnswers = (prev[currentIndex] as string[] || []);
        const newAnswers = currentAnswers.includes(option)
            ? currentAnswers.filter(a => a !== option)
            : [...currentAnswers, option];
        return { ...prev, [currentIndex]: newAnswers };
    });
  };

  const handleCheck = () => {
    if (isAnswerEmpty) return;
    const isAnswerCorrect = calculateIsCorrect();
    setIsAnswered(true);
    if (!isAnswerCorrect) {
        onQuestionIncorrect(currentQuestion.explanation);
        setWronglyAnsweredQuestions(prev => {
            if (prev.find(q => q.question === currentQuestion.question)) {
                return prev;
            }
            return [...prev, currentQuestion];
        });
    }
  };

  const handleNext = () => {
    if (currentIndex < practiceSet.length - 1) {
      setIsAnswered(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      setView('summary');
    }
  };
  
  const handleRetry = () => {
    setPracticeSet(wronglyAnsweredQuestions);
    setWronglyAnsweredQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setIsAnswered(false);
    setView('practicing');
  };

  const handleFinish = () => {
    onComplete();
  };
  
  const fillInTheBlankParts = currentQuestion?.type === 'fill-in-the-blank' 
    ? currentQuestion.question.split('___') 
    : [];

  const renderSummary = () => {
      const correctCount = practiceSet.length - wronglyAnsweredQuestions.length;
      const score = practiceSet.length > 0 ? Math.round((correctCount / practiceSet.length) * 100) : 100;
      const scoreColor = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';

      return (
          <div className="text-center animate-fade-in-up">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Practice Complete!</h2>
              <div className={`text-7xl font-extrabold my-6 ${scoreColor}`}>{score}%</div>
              <p className="text-slate-600 dark:text-slate-400">You answered {correctCount} out of {practiceSet.length} questions correctly.</p>

              {wronglyAnsweredQuestions.length > 0 && (
                  <div className="mt-8 text-left">
                      <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-slate-300">Review Incorrect Answers:</h3>
                      <div className="space-y-4 max-h-48 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600">
                          {wronglyAnsweredQuestions.map((q, i) => (
                              <div key={i} className="border-b dark:border-slate-600 pb-2 last:border-b-0">
                                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{q.question}</p>
                                  <p className="text-sm text-green-600 dark:text-green-400">Correct answer: {q.answer.join(', ')}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  {wronglyAnsweredQuestions.length > 0 && (
                      <button onClick={handleRetry} className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-bold rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-all">
                          <Refresh className="text-lg" />
                          <span>Retry Incorrect ({wronglyAnsweredQuestions.length})</span>
                      </button>
                  )}
                  <button onClick={handleFinish} className="w-full sm:w-auto px-8 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors">
                      Finish
                  </button>
              </div>
          </div>
      );
  };

  return (
    <>
        <div className="p-4 sm:p-6 md:p-8 animate-fade-in-up">
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg relative min-h-[500px] flex flex-col border dark:border-slate-700">
                 <button onClick={handleOpenExitModal} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors z-10" title="Exit Practice">
                    <XCircle className="text-2xl" />
                </button>
                {view === 'summary' ? renderSummary() : 
                    currentQuestion ? (
                        <div className={`flex-grow flex flex-col transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                            {/* Header */}
                            <div className="flex justify-between items-baseline mb-2 pr-8">
                                <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300">{practiceTitle}</h1>
                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{currentIndex + 1} / {practiceSet.length}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-6">
                                <div className={`${unitBgColor.replace('bg-', 'bg-')} h-2 rounded-full transition-all duration-300`} style={{ width: `${((currentIndex + 1) / practiceSet.length) * 100}%` }}></div>
                            </div>

                            {/* Question */}
                            <div className="flex-grow">
                                {currentQuestion.type === 'fill-in-the-blank' ? (
                                    <p className="text-xl leading-relaxed text-slate-800 dark:text-slate-200">
                                        {fillInTheBlankParts[0]}
                                        <input
                                            type="text"
                                            value={answers[currentIndex] as string || ''}
                                            onChange={(e) => handleAnswerChange(e.target.value)}
                                            disabled={isAnswered}
                                            className="inline-block w-48 mx-2 p-2 text-center text-lg bg-white dark:bg-slate-700 border-b-2 border-slate-300 dark:border-slate-500 focus:border-purple-500 outline-none transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-600"
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleCheck()}
                                        />
                                        {fillInTheBlankParts[1]}
                                    </p>
                                ) : (
                                    <p className="text-xl text-slate-800 dark:text-slate-200">{currentQuestion.question}</p>
                                )}

                                {/* Options */}
                                <div className="mt-6 space-y-3">
                                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map(option => (
                                        <button key={option} onClick={() => handleAnswerChange(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 font-semibold transition-all duration-200 
                                            ${isAnswered ? 'cursor-not-allowed' : 'hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'}
                                            ${answers[currentIndex] === option ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-500' : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'}
                                            ${isAnswered && currentQuestion.answer[0] === option ? '!bg-green-100 dark:!bg-green-900/50 !border-green-500 !text-green-800 dark:!text-green-200' : ''}
                                            ${isAnswered && answers[currentIndex] === option && !isCorrect ? '!bg-red-100 dark:!bg-red-900/50 !border-red-500 !text-red-800 dark:!text-red-200' : ''}
                                        `}>
                                            {option}
                                        </button>
                                    ))}
                                    {currentQuestion.type === 'select-all-that-apply' && currentQuestion.options?.map(option => {
                                        const isSelected = (answers[currentIndex] as string[] || []).includes(option);
                                        const isCorrectAnswer = currentQuestion.answer.includes(option);
                                        return (
                                            <button key={option} onClick={() => handleSataChange(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 font-semibold transition-all duration-200 flex items-center space-x-3
                                                ${isAnswered ? 'cursor-not-allowed' : 'hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'}
                                                ${isSelected ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-500' : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'}
                                                ${isAnswered && isCorrectAnswer ? '!bg-green-100 dark:!bg-green-900/50 !border-green-500 !text-green-800 dark:!text-green-200' : ''}
                                                ${isAnswered && isSelected && !isCorrectAnswer ? '!bg-red-100 dark:!bg-red-900/50 !border-red-500 !text-red-800 dark:!text-red-200' : ''}
                                            `}>
                                                <div className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-slate-400'} ${isAnswered && isCorrectAnswer ? '!bg-green-500 !border-green-500' : ''} ${isAnswered && isSelected && !isCorrectAnswer ? '!bg-red-500 !border-red-500' : ''}`}>
                                                    {isSelected && <i className="bi bi-check text-white text-lg font-bold"></i>}
                                                </div>
                                                <span>{option}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            {!isAnswered ? (
                                <div className="mt-8 pt-6 border-t dark:border-slate-700">
                                    <button onClick={handleCheck} disabled={isAnswerEmpty} className="w-full bg-purple-500 text-white font-bold p-4 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                                        Check
                                    </button>
                                </div>
                            ) : (
                                <div className={`mt-8 pt-6 border-t ${isCorrect ? 'border-green-300 dark:border-green-700' : 'border-red-300 dark:border-red-700'} ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} -mx-6 -mb-8 sm:-mx-8 sm:-mb-8 px-6 sm:px-8 py-6 rounded-b-2xl animate-fade-in`}>
                                    <div className="flex items-start space-x-3">
                                        <div className={`text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                            {isCorrect ? <CheckCircle /> : <XCircle />}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                                {isCorrect ? 'Correct!' : 'Not quite...'}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-300 mt-1">{currentQuestion.explanation}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleNext} className={`w-full mt-4 font-bold p-4 rounded-lg transition-colors ${isCorrect ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                                        {currentIndex < practiceSet.length - 1 ? 'Next' : 'Finish'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-center">
                            <p className="text-slate-500">No questions available for this practice session.</p>
                        </div>
                    )
                }
            </div>
        </div>
        </div>
        <ConfirmationModal
            isOpen={isExitModalOpen}
            onClose={() => setIsExitModalOpen(false)}
            onConfirm={onBack}
            title="Giving up?"
            message={exitMessage}
            confirmText="Yes, I'm a Quitter"
            cancelText="No, I'm a Fighter"
        />
    </>
  );
};

export default PracticeView;
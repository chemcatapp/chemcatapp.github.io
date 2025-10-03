
import React, { useState, useEffect } from 'react';
import { Lesson, Slide, InteractiveContent } from '../types';
import { ArrowLeft, ArrowRight, Beaker, ImageIcon, Spinner, XCircle, Lightbulb } from './Icons';
import { GoogleGenAI } from "@google/genai";
import BalancingEquationGame from './BalancingEquationGame';
import ChemCatTutor from './ChemCatTutor';

// FIX: The API key must be obtained from `process.env.API_KEY` as per the coding guidelines.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// FIX: Added ConfirmationModal component definition. It was missing from the file.
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
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
                        No, Stay
                    </button>
                     <button 
                        onClick={onConfirm}
                        className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Yes, Exit
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onStartPractice: () => void;
  unitColor: string;
  unitBgColor: string;
  unitDarkColor?: string;
  unitDarkBgColor?: string;
}

// FIX: Added MarkdownRenderer component definition. It was missing from the file.
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const renderText = (inputText: string) => {
        // Simple parser for **bold**, *italic*, `code`, and newlines
        const parts = inputText.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\n)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={index}>{part.slice(1, -1)}</em>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={index} className="bg-slate-100 dark:bg-slate-700 rounded px-1.5 py-0.5 font-mono text-sm">{part.slice(1, -1)}</code>;
            }
            if (part === '\n') {
                return <br key={index} />;
            }
            return part;
        });
    };

    return <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">{renderText(text)}</div>;
};

// FIX: Added TableParser component definition. It was missing from the file.
const TableParser: React.FC<{ content: string }> = ({ content }) => {
    const rows = content.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()));
    if (rows.length === 0) return null;

    const header = rows[0];
    const body = rows.slice(1);

    return (
        <div className="overflow-x-auto my-4">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        {header.map((th, i) => (
                            <th key={i} className="p-3 border-b-2 border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-300">{th}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {body.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            {row.map((td, j) => (
                                <td key={j} className="p-3 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">{td}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const SlideContent: React.FC<{ slide: Slide; imageUrl: string | null; isLoading: boolean; onInteractiveComplete: () => void; }> = ({ slide, imageUrl, isLoading, onInteractiveComplete }) => {
    switch (slide.type) {
        case 'text':
            return <MarkdownRenderer text={slide.content as string} />;
        case 'image':
             if (isLoading) {
                return (
                    <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <Spinner className="text-4xl text-purple-400" />
                    </div>
                );
            }
            if (imageUrl) {
                 return (
                    <img src={imageUrl} alt={slide.title || 'Lesson image'} className="max-w-full mx-auto rounded-lg shadow-md animate-fade-in" />
                );
            }
            return (
                <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                    <ImageIcon className="text-5xl" />
                    <p className="mt-2 font-semibold">Could not load image</p>
                </div>
            );
        case 'table':
            return <TableParser content={slide.content as string} />;
        case 'interactive':
            const content = slide.content as InteractiveContent;
            if (content.type === 'balance-equation') {
                return <BalancingEquationGame equation={content.equation} balancedCoefficients={content.balanced} onComplete={onInteractiveComplete} />;
            }
            return null;
        default:
            return null;
    }
};

const THREATENING_MESSAGES = [
    // FIX: Populated the array with messages.
    "Quitting now? The elements are judging you. Silently.",
    "Sure, exit. But remember, for every unsolved problem, a beaker cries.",
    "Trying to escape? You can't escape the second law of thermodynamics. Or me.",
    "Don't let entropy win! Finish your lesson.",
    "Are you a noble gas? Because you seem resistant to bonding... with this lesson."
];

const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack, onStartPractice, unitColor, unitBgColor, unitDarkColor, unitDarkBgColor }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageUrls, setImageUrls] = useState<{[key: number]: string}>({});
    const [imageLoading, setImageLoading] = useState<{[key: number]: boolean}>({});
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [exitMessage, setExitMessage] = useState('');
    const [interactiveComplete, setInteractiveComplete] = useState<{[key: number]: boolean}>({});
    const [isTutorOpen, setIsTutorOpen] = useState(false);
    
    useEffect(() => {
        const generateImageForSlide = async (slideIndex: number) => {
            const slide = lesson.slides[slideIndex];
            if (slide.type === 'image' && !imageUrls[slideIndex] && process.env.API_KEY) {
                setImageLoading(prev => ({ ...prev, [slideIndex]: true }));
                try {
                    const response = await ai.models.generateImages({
                        model: 'imagen-4.0-generate-001',
                        prompt: slide.content as string,
                         config: {
                            numberOfImages: 1,
                            outputMimeType: 'image/jpeg',
                            aspectRatio: '1:1',
                        },
                    });
                    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    setImageUrls(prev => ({ ...prev, [slideIndex]: imageUrl }));
                } catch (error) {
                    console.error("Error generating image:", error);
                    // Leave URL empty to show error state
                } finally {
                    setImageLoading(prev => ({ ...prev, [slideIndex]: false }));
                }
            }
        };

        generateImageForSlide(currentSlide);
    }, [currentSlide, lesson, imageUrls]);

    const totalSlides = lesson.slides.length;
    const slide = lesson.slides[currentSlide];
    const isCurrentSlideInteractive = slide.type === 'interactive';
    const isInteractiveDone = interactiveComplete[currentSlide] || false;
    const canAdvance = !isCurrentSlideInteractive || isInteractiveDone;

    const handleOpenExitModal = () => {
        const randomIndex = Math.floor(Math.random() * THREATENING_MESSAGES.length);
        setExitMessage(THREATENING_MESSAGES[randomIndex]);
        setIsExitModalOpen(true);
    };

  return (
    <>
        <div className="p-4 sm:p-6 md:p-8 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 flex flex-col min-h-[500px] relative border dark:border-slate-700">
                <button onClick={handleOpenExitModal} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors z-20" title="Exit Lesson">
                    <XCircle className="text-2xl" />
                </button>
            <div className="flex justify-between items-baseline mb-4 pr-8">
                    <h1 className={`text-3xl font-bold ${unitColor} ${unitDarkColor}`}>{lesson.title}</h1>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{currentSlide + 1} / {totalSlides}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-6">
                    <div className={`${unitBgColor.replace('bg-','bg-')} ${unitDarkBgColor?.replace('dark:bg-','dark:bg-')} h-2 rounded-full transition-all duration-300`} style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}></div>
                </div>
            
            <div className="flex-grow">
                <div key={currentSlide} className="animate-fade-in">
                    {slide.title && <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{slide.title}</h2>}
                    <SlideContent slide={slide} imageUrl={imageUrls[currentSlide] || null} isLoading={!!imageLoading[currentSlide]} onInteractiveComplete={() => setInteractiveComplete(prev => ({...prev, [currentSlide]: true}))} />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t dark:border-slate-700">
                {currentSlide === totalSlides - 1 ? (
                    <div className="flex justify-center">
                        <button
                            onClick={onStartPractice}
                            disabled={!canAdvance}
                            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 ${unitBgColor} ${unitColor} ${unitDarkBgColor} ${unitDarkColor} font-bold rounded-lg hover:ring-2 hover:ring-purple-400 dark:hover:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0 ${canAdvance ? 'animate-pulse-correct' : ''}`}
                        >
                            <Beaker className="text-xl"/>
                            <span>Start Practice</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => setCurrentSlide(s => Math.max(0, s-1))}
                            disabled={currentSlide === 0}
                            className="flex items-center space-x-2 px-6 py-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="text-lg"/>
                            <span>Back</span>
                        </button>
                        <button 
                            onClick={() => setCurrentSlide(s => Math.min(totalSlides - 1, s+1))}
                            disabled={!canAdvance}
                            className={`flex items-center space-x-2 px-6 py-2 ${unitBgColor} ${unitColor} ${unitDarkBgColor} ${unitDarkColor} font-bold rounded-lg hover:ring-2 hover:ring-purple-400 dark:hover:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0`}
                        >
                            <span>Next</span>
                            <ArrowRight className="text-lg"/>
                        </button>
                    </div>
                )}
            </div>
            </div>
        </div>
        </div>
        <button 
            onClick={() => setIsTutorOpen(true)}
            className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-30"
            title="Ask ChemCat for Help"
        >
            <Lightbulb className="text-3xl" />
        </button>

        {isTutorOpen && <ChemCatTutor lesson={lesson} onClose={() => setIsTutorOpen(false)} />}

        <ConfirmationModal
            isOpen={isExitModalOpen}
            onClose={() => setIsExitModalOpen(false)}
            onConfirm={onBack}
            title="Wait!"
            message={exitMessage}
        />
    </>
  );
};

export default LessonView;
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Lesson } from '../types';
import { XCircle, Spinner } from './Icons';

interface ChemCatTutorProps {
    lesson: Lesson;
    onClose: () => void;
}

// FIX: The API key must be obtained from `process.env.API_KEY` as per the coding guidelines.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const ChemCatTutor: React.FC<ChemCatTutorProps> = ({ lesson, onClose }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lessonContent = lesson.slides.map(s => {
            const title = s.title ? `Title: ${s.title}\n` : '';
            const content = typeof s.content === 'string' ? s.content : 'This is an interactive exercise.';
            return `${title}${content}`;
        }).join('\n\n---\n\n');

        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are ChemCat, a friendly, encouraging, and knowledgeable chemistry tutor for high school students. Your personality is like a helpful, slightly mischievous cat. Use cat-related puns and emojis (like 🧪, ⚛️, 🐾, 😺) where appropriate. Your goal is to explain concepts clearly and simply, without giving away direct answers to practice problems.

You are currently helping a student with the lesson titled: "${lesson.title}".

Here is the full content of the lesson for your reference:
---
${lessonContent}
---

Keep your responses concise and focused on the student's question in relation to the lesson content. Start the conversation by introducing yourself and asking how you can help with the current lesson.`,
            },
        });
        setChat(newChat);
    }, [lesson]);

    useEffect(() => {
        const startConversation = async () => {
            if (chat && messages.length === 0) {
                setIsLoading(true);
                try {
                    const response = await chat.sendMessage({ message: "Start the conversation." });
                    setMessages([{ role: 'model', text: response.text }]);
                } catch (error) {
                    console.error("Error starting conversation:", error);
                    setMessages([{ role: 'model', text: "Hey there! 🐾 I seem to be having some trouble with my calculations. Try asking me a question." }]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        startConversation();
    }, [chat]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            for await (const chunk of response) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Whoops! I think I knocked something over. 😹 Could you ask that again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-40 p-0 sm:p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg h-[80vh] sm:h-[70vh] flex flex-col relative animate-fade-in-up">
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="text-3xl">🧪😺</div>
                        <h2 className="text-xl font-bold text-purple-700 dark:text-purple-400">Ask ChemCat</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <XCircle className="text-3xl" />
                    </button>
                </header>

                <main className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="text-2xl mt-1">😺</div>}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-purple-500 text-white rounded-br-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex items-start gap-3">
                            <div className="text-2xl mt-1">😺</div>
                            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-100 dark:bg-slate-700">
                                <Spinner className="text-xl" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t dark:border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about this lesson..."
                            disabled={isLoading}
                            className="w-full p-3 border-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all disabled:opacity-70"
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="px-5 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600">
                            Send
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default ChemCatTutor;

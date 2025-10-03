import React, { useState, useEffect, useRef, FC } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ArrowLeft, Spinner } from './Icons';

interface ChatViewProps {
    onBack: () => void;
}

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const ChatView: FC<ChatViewProps> = ({ onBack }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chat
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are ChemCat, a friendly, encouraging, and knowledgeable chemistry tutor for high school students. Your personality is like a helpful, slightly mischievous cat. Use cat-related puns and emojis (like 🧪, ⚛️, 🐾, 😺) where appropriate. Your goal is to explain concepts clearly and simply. You can answer general chemistry questions.`,
            },
        });
        setChat(newChat);
    }, []);

    useEffect(() => {
        const startConversation = async () => {
            if (chat && messages.length === 0) {
                try {
                    const response = await chat.sendMessage({ message: "Introduce yourself and ask what I want to learn about today." });
                    setMessages([{ role: 'model', text: response.text }]);
                } catch (error) {
                    console.error("Error starting conversation:", error);
                    setMessages([{ role: 'model', text: "Hey there! 🐾 I'm having some trouble thinking. You can still ask me a question." }]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        startConversation();
    }, [chat]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessageStream({ message: currentInput });
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
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="relative p-0 bg-white dark:bg-slate-800 rounded-2xl shadow-md border dark:border-slate-700 h-[75vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700 flex-shrink-0">
                    <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 font-semibold transition-colors">
                        <ArrowLeft className="text-lg" />
                        <span>Dashboard</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="text-3xl">🧪😺</div>
                        <h1 className="text-xl font-bold text-purple-700 dark:text-purple-400">Chat with ChemCat</h1>
                    </div>
                </header>

                <main className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="text-2xl mt-1 flex-shrink-0">😺</div>}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-purple-500 text-white rounded-br-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="text-2xl mt-1 flex-shrink-0">😺</div>
                            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-100 dark:bg-slate-700">
                                <Spinner className="text-xl" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800 rounded-b-2xl">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a chemistry question..."
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

export default ChatView;

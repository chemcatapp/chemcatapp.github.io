import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { debounce } from 'lodash';
import { Spinner, CheckCircle, XCircle } from './Icons';

const ForgotPasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setMessage('If an account exists for that email, a password reset link has been sent.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-8 relative animate-fade-in-up">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Reset Password</h2>
                 <p className="text-slate-600 dark:text-slate-400 mb-6 text-center text-sm">Enter your email and we'll send you a link to get back into your account.</p>
                {message && <p className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4 text-sm">{message}</p>}
                {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</p>}
                {!message && (
                    <form onSubmit={handlePasswordReset}>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1" htmlFor="reset-email">Email</label>
                            <input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-purple-500 text-white font-bold p-3 rounded-lg hover:bg-purple-600 transition-colors mt-6 disabled:bg-slate-400">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
                 <button onClick={onClose} className="w-full text-center text-sm text-slate-600 dark:text-slate-400 mt-6 font-bold hover:underline">
                    Back to Login
                </button>
            </div>
        </div>
    );
};

const LoginView: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');

    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
    const [usernameMessage, setUsernameMessage] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const checkUsername = useCallback(debounce(async (uname: string) => {
        if (uname.length === 0) {
            setUsernameStatus('idle');
            return;
        }

        if (!/^[a-zA-Z0-9_]{3,15}$/.test(uname)) {
            setUsernameStatus('invalid');
            setUsernameMessage('Must be 3-15 chars, letters, numbers, or _');
            return;
        }

        setUsernameStatus('checking');
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', uname.toLowerCase())
                .single();

            if (data) {
                setUsernameStatus('taken');
                setUsernameMessage('Username is already taken.');
            } else if (error && error.code === 'PGRST116') {
                setUsernameStatus('available');
                setUsernameMessage('Username is available!');
            } else if (error) {
                throw error;
            }
        } catch (err) {
            console.error('Error checking username:', err);
            setUsernameStatus('invalid');
            setUsernameMessage('Error checking username.');
        }
    }, 500), []);

    useEffect(() => {
        if (!isLoginView) {
            checkUsername(username);
        }
    }, [username, isLoginView, checkUsername]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        });
        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (usernameStatus !== 'available') {
            setError(usernameMessage || 'Please choose a valid and available username.');
            setLoading(false);
            return;
        }
        if (!email || !password || !displayName) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: displayName,
                    username: username.toLowerCase(),
                }
            }
        });

        if (error) {
            if (error.message.includes('profiles_username_key')) {
                 setError('This username is already taken. Please choose another.');
            } else {
                 setError(error.message);
            }
        } else if (data.user && !data.session) {
            setShowVerificationMessage(true);
        }
        setLoading(false);
    };

    if (showVerificationMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
                <div className="w-full max-w-md text-center">
                     <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                        <div className="text-5xl mb-4">📬</div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Check your inbox!</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            We've sent a verification link to <strong>{email}</strong>. Please click the link in the email to activate your account.
                        </p>
                        <button 
                            onClick={() => {
                                setShowVerificationMessage(false);
                                setIsLoginView(true);
                                setEmail('');
                                setPassword('');
                            }}
                            className="w-full bg-purple-500 text-white font-bold p-3 rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="text-5xl">🧪</div>
                        <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400">ChemCat</h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Your motivational chemistry (and science) tutor.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">{isLoginView ? 'Welcome Back!' : 'Create Your Account'}</h2>
                    <form onSubmit={isLoginView ? handleLogin : handleSignUp}>
                        {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">{error}</p>}
                        {isLoginView && error.includes('Invalid') && (
                            <div className="text-center -mt-2 mb-4">
                                <button type="button" onClick={() => setShowForgotPassword(true)} className="font-bold text-sm text-purple-600 dark:text-purple-400 hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                        <div className="space-y-4">
                            {isLoginView ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1" htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1" htmlFor="displayName">Display Name</label>
                                        <input
                                            id="displayName"
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1" htmlFor="username">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                                @
                                            </div>
                                            <input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                                className="w-full p-3 pl-8 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                {usernameStatus === 'checking' && <Spinner className="text-purple-500" />}
                                                {usernameStatus === 'available' && <CheckCircle className="text-green-500" />}
                                                {usernameStatus === 'taken' && <XCircle className="text-red-500" />}
                                                {usernameStatus === 'invalid' && <XCircle className="text-red-500" />}
                                            </div>
                                        </div>
                                         {usernameStatus !== 'idle' && usernameStatus !== 'checking' && usernameMessage && (
                                            <p className={`text-xs mt-1 ${usernameStatus === 'available' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {usernameMessage}
                                            </p>
                                        )}
                                    </div>
                                     <div>
                                        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1" htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-1" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-500 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-purple-500 text-white font-bold p-3 rounded-lg hover:bg-purple-600 transition-colors mt-6 disabled:bg-slate-400"
                        >
                            {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => {
                                setIsLoginView(!isLoginView);
                                setError('');
                            }}
                            className="font-bold text-purple-600 dark:text-purple-400 hover:underline ml-1"
                        >
                            {isLoginView ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
        {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
        </>
    );
};

export default LoginView;
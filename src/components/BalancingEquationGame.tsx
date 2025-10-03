import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from './Icons';

interface BalancingEquationGameProps {
    equation: string;
    balancedCoefficients: number[];
    onComplete: () => void;
}

const BalancingEquationGame: React.FC<BalancingEquationGameProps> = ({ equation, balancedCoefficients, onComplete }) => {
    const parts = useMemo(() => equation.split(/(\s*\+\s*|\s*->\s*)/), [equation]);
    const numInputs = useMemo(() => parts.filter(p => p.match(/[a-zA-Z]/)).length, [parts]);
    
    const [coefficients, setCoefficients] = useState<string[]>(Array(numInputs).fill(''));
    const [status, setStatus] = useState<'unchecked' | 'correct' | 'incorrect'>('unchecked');

    const handleInputChange = (index: number, value: string) => {
        if (status !== 'unchecked') setStatus('unchecked');
        // Allow only numbers and limit length
        if (/^\d*$/.test(value) && value.length < 3) {
            const newCoefficients = [...coefficients];
            newCoefficients[index] = value;
            setCoefficients(newCoefficients);
        }
    };

    const handleCheck = () => {
        const userCoefficients = coefficients.map(c => parseInt(c || '1', 10));
        if (JSON.stringify(userCoefficients) === JSON.stringify(balancedCoefficients)) {
            setStatus('correct');
            onComplete();
        } else {
            setStatus('incorrect');
        }
    };

    let inputIndex = 0;

    return (
        <div className={`p-6 border-2 rounded-lg transition-colors duration-300 ${status === 'correct' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : ''} ${status === 'incorrect' ? 'border-red-400 bg-red-50 dark:bg-red-900/20 animate-shake' : 'border-slate-200 dark:border-slate-600'}`}>
            <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-4 text-2xl font-bold text-slate-800 dark:text-slate-200">
                {parts.map((part, i) => {
                    if (part.match(/[a-zA-Z]/)) {
                        const currentIndex = inputIndex++;
                        return (
                            <React.Fragment key={i}>
                                <input
                                    type="text"
                                    value={coefficients[currentIndex]}
                                    onChange={(e) => handleInputChange(currentIndex, e.target.value)}
                                    placeholder="1"
                                    className="w-12 h-12 text-center text-xl font-bold bg-white dark:bg-slate-700 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                />
                                <span dangerouslySetInnerHTML={{ __html: part.replace(/(\d+)/g, '<sub>$1</sub>') }} />
                            </React.Fragment>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </div>

            <div className="mt-6 flex flex-col items-center">
                <button
                    onClick={handleCheck}
                    disabled={status === 'correct'}
                    className="px-8 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    Check Balance
                </button>
                {status === 'correct' && (
                    <div className="flex items-center mt-4 font-semibold text-green-600 dark:text-green-400 animate-fade-in">
                        <CheckCircle className="mr-2 text-xl" />
                        Correct! Well done.
                    </div>
                )}
                 {status === 'incorrect' && (
                    <div className="flex items-center mt-4 font-semibold text-red-600 dark:text-red-400 animate-fade-in">
                        <XCircle className="mr-2 text-xl" />
                        Not quite, try adjusting the coefficients.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BalancingEquationGame;

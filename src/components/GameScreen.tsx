
'use client';

import { Theme, Language, ScoreEntry } from '@/types/game';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Check, X, ShieldAlert } from 'lucide-react';

interface Props {
    theme: Theme;
    lang: Language;
    onFinish: (score: ScoreEntry[]) => void;
}

export default function GameScreen({ theme, lang, onFinish }: Props) {
    const { tilt, permission, requestPermission } = useDeviceOrientation();
    const [started, setStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState<ScoreEntry[]>([]);
    const [flash, setFlash] = useState<'correct' | 'pass' | null>(null);

    // Audio placeholders or just visual feedback as requested
    const items = useRef([...theme.items].sort(() => Math.random() - 0.5));
    const tiltLocked = useRef(false);

    useEffect(() => {
        if (!permission || permission === 'default') {
            requestPermission();
        }
    }, [permission, requestPermission]);

    // Game start countdown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setStarted(true);
        }
    }, [countdown]);

    // Game timer
    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (started && timeLeft === 0) {
            onFinish(score);
        }
    }, [started, timeLeft, score, onFinish]);

    const handleNext = useCallback((status: 'correct' | 'pass') => {
        if (tiltLocked.current) return;

        setScore(prev => [...prev, { word: items.current[currentIndex].translations[lang], status }]);
        setFlash(status);
        tiltLocked.current = true;

        setTimeout(() => {
            setFlash(null);
            setCurrentIndex(prev => (prev + 1) % items.current.length);
            tiltLocked.current = false;
        }, 800);
    }, [currentIndex, lang]);

    // Tilt detection trigger
    useEffect(() => {
        if (started && !tiltLocked.current) {
            if (tilt === 'down') {
                handleNext('correct');
            } else if (tilt === 'up') {
                handleNext('pass');
            }
        }
    }, [tilt, started, handleNext]);

    if (permission === 'denied') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-white landscape-content">
                <ShieldAlert className="mb-4 h-16 w-16 text-rose-500" />
                <h2 className="mb-2 text-2xl font-bold text-center">Motion Permission Denied</h2>
                <p className="text-slate-400 text-center">This game needs accelerometer access to detect tilts. Please enable it in settings and reload.</p>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 landscape-content">
                <motion.div
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    className="text-[12rem] font-black italic text-rose-500"
                >
                    {countdown > 0 ? countdown : 'GO!'}
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden transition-colors duration-300 landscape-content ${flash === 'correct' ? 'bg-green-600' : flash === 'pass' ? 'bg-rose-600' : 'bg-slate-950'
            }`}>
            {/* HUD */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-md">
                    <Timer className="h-5 w-5 text-rose-400" />
                    <span className="text-xl font-mono font-black text-white">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-md">
                    <span className="text-xl font-black text-white">SCORE: {score.filter(s => s.status === 'correct').length}</span>
                </div>
            </div>

            {/* Word Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="px-12 text-center"
                >
                    <h1 className="text-7xl font-black uppercase tracking-tight text-white md:text-9xl">
                        {items.current[currentIndex].translations[lang]}
                    </h1>
                </motion.div>
            </AnimatePresence>

            {/* Tilt Instructions (Subtle) */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-12 text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-8 rounded-full bg-green-500/20" />
                    <span className="text-sm font-bold uppercase tracking-widest">Tilt Down = Correct</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-8 rounded-full bg-rose-500/20" />
                    <span className="text-sm font-bold uppercase tracking-widest">Tilt Up = Pass</span>
                </div>
            </div>

            {/* Visual feedback icons on flash */}
            <AnimatePresence>
                {flash === 'correct' && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <Check className="h-64 w-64 text-white/50" />
                    </motion.div>
                )}
                {flash === 'pass' && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <X className="h-64 w-64 text-white/50" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


'use client';

import { Theme, Language, ScoreEntry } from '@/types/game';
import { useDeviceOrientation, TiltDirection } from '@/hooks/useDeviceOrientation';
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

    const items = useRef([...theme.items].sort(() => Math.random() - 0.5));

    // THE FIX: "isArmed" ensures the phone must return to NEUTRAL before another action triggers.
    const isArmed = useRef(false);
    const tiltLocked = useRef(false);

    useEffect(() => {
        if (!permission || permission === 'default') {
            requestPermission();
        }
    }, [permission, requestPermission]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setStarted(true);
        }
    }, [countdown]);

    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (started && timeLeft === 0) {
            onFinish(score);
        }
    }, [started, timeLeft, score, onFinish]);

    const handleNext = useCallback((status: 'correct' | 'pass') => {
        if (tiltLocked.current || !isArmed.current) return;

        setScore(prev => [...prev, { word: items.current[currentIndex].translations[lang], status }]);
        setFlash(status);
        tiltLocked.current = true;
        isArmed.current = false; // Disarm until neutral again

        setTimeout(() => {
            setFlash(null);
            setCurrentIndex(prev => (prev + 1) % items.current.length);
            tiltLocked.current = false;
        }, 1000);
    }, [currentIndex, lang]);

    // Tilt detection trigger with Arming logic
    useEffect(() => {
        if (!started) return;

        if (tilt === 'neutral') {
            isArmed.current = true;
        } else if (isArmed.current && !tiltLocked.current) {
            if (tilt === 'down') {
                handleNext('correct');
            } else if (tilt === 'up') {
                handleNext('pass');
            }
        }
    }, [tilt, started, handleNext]);

    if (permission === 'denied') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-white landscape-content-hidden">
                <ShieldAlert className="mb-4 h-12 w-12 text-rose-500" />
                <h2 className="mb-2 text-xl font-bold text-center">Motion Permission Denied</h2>
                <p className="text-slate-400 text-center text-sm">Please enable accelerometer access in settings and reload.</p>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 landscape-content-hidden">
                <motion.div
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    className="text-9xl font-black italic text-rose-500"
                >
                    {countdown > 0 ? countdown : 'GO!'}
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden transition-colors duration-500 landscape-content-hidden ${flash === 'correct' ? 'bg-green-600' : flash === 'pass' ? 'bg-rose-600' : 'bg-slate-950'
            }`}>
            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 transition-opacity duration-300" style={{ opacity: flash ? 0 : 1 }}>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 backdrop-blur-md">
                    <Timer className="h-4 w-4 text-rose-400" />
                    <span className="text-lg font-mono font-black text-white">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 backdrop-blur-md">
                    <span className="text-lg font-black text-white">SCORE: {score.filter(s => s.status === 'correct').length}</span>
                </div>
            </div>

            {/* Word Display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="px-6 text-center"
                >
                    <h1 className="text-5xl font-black uppercase tracking-tight text-white md:text-8xl">
                        {flash === 'correct' ? 'CORRECT!' : flash === 'pass' ? 'PASS' : items.current[currentIndex].translations[lang]}
                    </h1>
                </motion.div>
            </AnimatePresence>

            {/* Instructions */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-slate-500 pointer-events-none transition-opacity" style={{ opacity: flash ? 0 : 1 }}>
                <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px]">
                    <div className="h-1.5 w-6 rounded-full bg-green-500" />
                    <span className={isArmed.current ? 'text-slate-300' : 'text-slate-700'}>Tilting Down...</span>
                </div>
                <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px]">
                    <div className="h-1.5 w-6 rounded-full bg-rose-500" />
                    <span className={isArmed.current ? 'text-slate-300' : 'text-slate-700'}>Tilting Up...</span>
                </div>
            </div>

            {/* Visual feedback icons on flash */}
            <AnimatePresence>
                {flash === 'correct' && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <Check className="h-32 w-32 text-white/40" />
                    </motion.div>
                )}
                {flash === 'pass' && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <X className="h-32 w-32 text-white/40" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

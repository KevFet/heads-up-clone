
'use client';

import { Theme, Language, ScoreEntry } from '@/types/game';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Timer, Check, X, PartyPopper } from 'lucide-react';

interface Props {
    theme: Theme;
    lang: Language;
    onFinish: (score: ScoreEntry[]) => void;
}

export default function GameScreen({ theme, lang, onFinish }: Props) {
    const [started, setStarted] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState<ScoreEntry[]>([]);
    const [flash, setFlash] = useState<'correct' | 'pass' | null>(null);

    const items = useRef([...theme.items].sort(() => Math.random() - 0.5));
    const tiltLocked = useRef(false);

    // Motion values for swipe
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const background = useTransform(
        x,
        [-150, 0, 150],
        ['rgba(225, 29, 72, 0.4)', 'rgba(15, 23, 42, 0)', 'rgba(34, 197, 94, 0.4)']
    );

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
            x.set(0); // Reset position
            tiltLocked.current = false;
        }, 500);
    }, [currentIndex, lang, x]);

    const onDragEnd = (event: any, info: any) => {
        if (tiltLocked.current) return;

        const threshold = 100;
        if (info.offset.x > threshold) {
            handleNext('correct');
        } else if (info.offset.x < -threshold) {
            handleNext('pass');
        }
    };

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
        <motion.div
            style={{ backgroundColor: background }}
            className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden transition-colors duration-300 landscape-content-hidden ${flash === 'correct' ? 'bg-green-600/80' : flash === 'pass' ? 'bg-rose-600/80' : 'bg-slate-950'
                }`}
        >
            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 backdrop-blur-md border border-white/5">
                    <Timer className="h-4 w-4 text-rose-400" />
                    <span className="text-lg font-mono font-black text-white">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 backdrop-blur-md border border-white/5">
                    <span className="text-lg font-black text-white">SCORE: {score.filter(s => s.status === 'correct').length}</span>
                </div>
            </div>

            {/* Swipeable Card Area */}
            <div className="relative flex h-full w-full items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {!tiltLocked.current && (
                        <motion.div
                            key={currentIndex}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            style={{ x, rotate, opacity }}
                            onDragEnd={onDragEnd}
                            whileDrag={{ scale: 1.05 }}
                            className="flex aspect-video w-full max-w-2xl cursor-grab items-center justify-center rounded-[2rem] bg-slate-900 shadow-2xl border border-white/10 active:cursor-grabbing"
                        >
                            <h1 className="select-none px-6 text-center text-5xl font-black uppercase tracking-tight text-white md:text-8xl">
                                {items.current[currentIndex].translations[lang]}
                            </h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Swipe Indicators */}
            <div className={`absolute bottom-6 left-0 right-0 flex justify-center gap-12 text-slate-500 transition-opacity duration-300 ${flash ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <X className="h-4 w-4 text-rose-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-300">Swipe Left to Pass</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-300">Swipe Right for Correct</span>
                        <Check className="h-4 w-4 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Flash Overlays */}
            <AnimatePresence>
                {flash === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-green-500"
                    >
                        <Check className="h-48 w-48 text-white stroke-[3]" />
                    </motion.div>
                )}
                {flash === 'pass' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-rose-500"
                    >
                        <X className="h-48 w-48 text-white stroke-[3]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

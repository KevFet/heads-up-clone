
'use client';

import { Language } from '@/types/game';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Check, XCircle, Timer, Users } from 'lucide-react';

interface Props {
    lang: Language;
    onClose: () => void;
}

export default function RulesModal({ lang, onClose }: Props) {
    const t = {
        title: { en: 'How to Play', fr: 'Règles du Jeu', 'es-MX': 'Cómo Jugar' },
        step1: {
            en: 'Choose a theme and language to start.',
            fr: 'Choisissez un thème et une langue pour commencer.',
            'es-MX': 'Elige un tema e idioma para empezar.'
        },
        step2: {
            en: 'Hold the phone so you can see the screen.',
            fr: 'Tenez le téléphone pour voir l\'écran.',
            'es-MX': 'Sujeta el teléfono de modo que veas la pantalla.'
        },
        step3: {
            en: 'Your friends must help you guess the word displayed.',
            fr: 'Vos amis doivent vous faire deviner le mot affiché.',
            'es-MX': 'Tus amigos deben ayudarte a adivinar la palabra.'
        },
        swipeRight: {
            en: 'Guessed it? Swipe RIGHT!',
            fr: 'Deviné ? Swippez vers la DROITE !',
            'es-MX': '¿Adivinaste? ¡Desliza a la DERECHA!'
        },
        swipeLeft: {
            en: 'Need a pass? Swipe LEFT.',
            fr: 'Passer ? Swippez vers la GAUCHE.',
            'es-MX': '¿Pasar? Desliza a la IZQUIERDA.'
        },
        timer: {
            en: 'You have 60 seconds to score as much as possible!',
            fr: 'Vous avez 60 secondes pour marquer un maximum !',
            'es-MX': '¡Tienes 60 segundos para anotar lo máximo posible!'
        },
        close: { en: 'Got it!', fr: 'Compris !', 'es-MX': '¡Entendido!' }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md landscape-content-hidden"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-2xl rounded-3xl bg-slate-900 p-6 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-8 w-8 text-rose-500" />
                    <h2 className="text-3xl font-black text-white">{t.title[lang]}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-500 font-bold">1</div>
                            <p className="text-slate-300 font-medium">{t.step1[lang]}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-500 font-bold">2</div>
                            <p className="text-slate-300 font-medium">{t.step2[lang]}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-500 font-bold">3</div>
                            <p className="text-slate-300 font-medium">{t.step3[lang]}</p>
                        </div>
                    </div>

                    <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500" />
                            <p className="text-sm font-bold text-slate-200">{t.swipeRight[lang]}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <XCircle className="h-5 w-5 text-rose-500" />
                            <p className="text-sm font-bold text-slate-200">{t.swipeLeft[lang]}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Timer className="h-5 w-5 text-amber-500" />
                            <p className="text-sm font-bold text-slate-200">{t.timer[lang]}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full rounded-2xl bg-rose-500 py-4 text-xl font-black text-white shadow-xl shadow-rose-500/20 hover:bg-rose-400 transition-all hover:scale-[1.02] active:scale-95"
                >
                    {t.close[lang]}
                </button>
            </motion.div>
        </motion.div>
    );
}

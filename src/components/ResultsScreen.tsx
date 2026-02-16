
'use client';

import { ScoreEntry, Language } from '@/types/game';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Check, X, ArrowLeft } from 'lucide-react';

interface Props {
    score: ScoreEntry[];
    lang: Language;
    onRestart: () => void;
    onHome: () => void;
}

export default function ResultsScreen({ score, lang, onRestart, onHome }: Props) {
    const correctCount = score.filter(s => s.status === 'correct').length;
    const total = score.length;

    const t = {
        results: { en: 'RESULTS', fr: 'RÉSULTATS', 'es-MX': 'RESULTADOS' },
        back: { en: 'HOME', fr: 'ACCUEIL', 'es-MX': 'INICIO' },
        playAgain: { en: 'PLAY AGAIN', fr: 'REJOUER', 'es-MX': 'JUGAR DE NUEVO' },
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 landscape-content overflow-y-auto">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-4 mb-8"
            >
                <Trophy className="h-10 w-10 text-yellow-500" />
                <h1 className="text-4xl font-black text-white">{t.results[lang]}</h1>
            </motion.div>

            <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Score Card */}
                <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-900/50 p-8 border border-white/5">
                    <span className="text-8xl font-black text-rose-500 mb-2">{correctCount}</span>
                    <span className="text-xl font-bold text-slate-400 uppercase tracking-widest">Points</span>
                </div>

                {/* Word List */}
                <div className="rounded-3xl bg-slate-900/50 p-6 border border-white/5 max-h-[40vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-3">
                        {score.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-800/40 p-3">
                                <span className="font-bold text-slate-200">{item.word}</span>
                                {item.status === 'correct' ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                    <X className="h-5 w-5 text-rose-500" />
                                )}
                            </div>
                        ))}
                        {score.length === 0 && (
                            <div className="text-center text-slate-500 italic py-8">No words guessed</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pb-12">
                <button
                    onClick={onHome}
                    className="flex items-center gap-2 rounded-full bg-slate-800 px-8 py-4 font-black text-white transition-all hover:bg-slate-700"
                >
                    <ArrowLeft className="h-5 w-5" />
                    {t.back[lang]}
                </button>
                <button
                    onClick={onRestart}
                    className="flex items-center gap-2 rounded-full bg-rose-500 px-8 py-4 font-black text-white shadow-xl shadow-rose-500/20 transition-all hover:bg-rose-400 hover:scale-105"
                >
                    <RefreshCw className="h-5 w-5" />
                    {t.playAgain[lang]}
                </button>
            </div>
        </div>
    );
}

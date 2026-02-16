
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

    const t = {
        results: { en: 'RESULTS', fr: 'RÉSULTATS', 'es-MX': 'RESULTADOS' },
        back: { en: 'HOME', fr: 'ACCUEIL', 'es-MX': 'INICIO' },
        playAgain: { en: 'PLAY AGAIN', fr: 'REJOUER', 'es-MX': 'JUGAR DE NUEVO' },
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 p-4 landscape-content-hidden overflow-y-auto">
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-3 mb-4 shrink-0"
            >
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h1 className="text-2xl font-black text-white">{t.results[lang]}</h1>
            </motion.div>

            <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Score Card */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/50 p-4 border border-white/5">
                    <span className="text-6xl font-black text-rose-500">{correctCount}</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Points</span>
                </div>

                {/* Word List */}
                <div className="rounded-2xl bg-slate-900/50 p-4 border border-white/5 max-h-[30vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        {score.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-800/40 p-2">
                                <span className="text-sm font-bold text-slate-200">{item.word}</span>
                                {item.status === 'correct' ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <X className="h-4 w-4 text-rose-500" />
                                )}
                            </div>
                        ))}
                        {score.length === 0 && (
                            <div className="text-center text-slate-500 italic py-4 text-sm">No words guessed</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pb-8 shrink-0">
                <button
                    onClick={onHome}
                    className="flex items-center gap-2 rounded-full bg-slate-800 px-6 py-3 text-sm font-black text-white transition-all hover:bg-slate-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t.back[lang]}
                </button>
                <button
                    onClick={onRestart}
                    className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-black text-white shadow-xl shadow-rose-500/20 transition-all hover:bg-rose-400 hover:scale-105"
                >
                    <RefreshCw className="h-4 w-4" />
                    {t.playAgain[lang]}
                </button>
            </div>
        </div>
    );
}


'use client';

import { Theme, Language } from '@/types/game';
import { themes } from '@/data/themes';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { useState } from 'react';

interface Props {
    onSelect: (theme: Theme, lang: Language) => void;
}

export default function ThemeSelector({ onSelect }: Props) {
    const [lang, setLang] = useState<Language>('en');

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'es-MX', label: 'Español', flag: '🇲🇽' },
    ];

    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 p-6 landscape-content overflow-y-auto">
            <div className="mb-8 flex w-full max-w-4xl flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <PartyPopper className="h-8 w-8 text-rose-500" />
                    <h1 className="text-3xl font-black tracking-tighter text-white">HEADS UP CLONE</h1>
                </div>

                <div className="flex gap-2 rounded-full bg-slate-900/50 p-1 backdrop-blur-md">
                    {languages.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => setLang(l.code)}
                            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition-all ${lang === l.code
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <span>{l.flag}</span>
                            <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid w-full max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-10">
                {themes.map((theme, idx) => (
                    <motion.button
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(theme, lang)}
                        className="group flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl bg-slate-900/40 p-4 transition-all hover:bg-slate-800/60 border border-white/5 hover:border-rose-500/30"
                    >
                        <span className="text-4xl transition-transform group-hover:scale-110">{theme.icon}</span>
                        <span className="text-center text-xs font-black uppercase tracking-wider text-slate-200">
                            {theme.name[lang]}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

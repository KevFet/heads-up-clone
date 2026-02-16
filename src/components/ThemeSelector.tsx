
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
        <div className="flex h-screen flex-col items-center bg-slate-950 p-4 landscape-content-hidden overflow-hidden">
            <div className="mb-4 flex w-full max-w-4xl flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                    <PartyPopper className="h-6 w-6 text-rose-500" />
                    <h1 className="text-xl font-black tracking-tighter text-white">HEADS UP</h1>
                </div>

                <div className="flex gap-1 rounded-full bg-slate-900/50 p-1 backdrop-blur-md">
                    {languages.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => setLang(l.code)}
                            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold transition-all ${lang === l.code
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <span>{l.flag}</span>
                            <span className="hidden sm:inline">{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 overflow-y-auto pb-10 custom-scrollbar pr-2 h-full">
                {themes.map((theme, idx) => (
                    <motion.button
                        key={theme.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(theme, lang)}
                        className="group flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-xl bg-slate-900/40 p-2 transition-all hover:bg-slate-800/60 border border-white/5 hover:border-rose-500/30"
                    >
                        <span className="text-2xl transition-transform group-hover:scale-110">{theme.icon}</span>
                        <span className="text-center text-[10px] font-black uppercase tracking-wider text-slate-200 line-clamp-1 px-1">
                            {theme.name[lang]}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

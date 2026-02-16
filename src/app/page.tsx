
'use client';

import { useState } from 'react';
import { GameState, Theme, Language, ScoreEntry } from '@/types/game';
import ThemeSelector from '@/components/ThemeSelector';
import GameScreen from '@/components/GameScreen';
import ResultsScreen from '@/components/ResultsScreen';
import LandscapeWarning from '@/components/LandscapeWarning';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [lastScore, setLastScore] = useState<ScoreEntry[]>([]);

  const handleThemeSelect = (theme: Theme, lang: Language) => {
    setSelectedTheme(theme);
    setLanguage(lang);
    setGameState('INSTRUCTIONS');
  };

  const startPlaying = () => {
    setGameState('PLAYING');
  };

  const handleGameFinish = (score: ScoreEntry[]) => {
    setLastScore(score);
    setGameState('RESULTS');
  };

  const resetGame = () => {
    setGameState('LOBBY');
    setSelectedTheme(null);
    setLastScore([]);
  };

  const replayTheme = () => {
    setGameState('INSTRUCTIONS');
    setLastScore([]);
  };

  const t = {
    ready: { en: 'READY?', fr: 'PRÊT ?', 'es-MX': '¿LISTO?' },
    instructions: {
      en: 'Place the phone on your forehead. Tilt DOWN for CORRECT, UP to PASS.',
      fr: 'Placez le téléphone sur votre front. Penchez vers le BAS pour CORRECT, vers le HAUT pour PASSER.',
      'es-MX': 'Coloca el teléfono en tu frente. Inclina hacia ABAJO si es CORRECTO, hacia ARRIBA para PASAR.'
    },
    start: { en: 'START', fr: 'COMMENCER', 'es-MX': 'EMPEZAR' }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-rose-500/30">
      <LandscapeWarning />

      <AnimatePresence mode="wait">
        {gameState === 'LOBBY' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ThemeSelector onSelect={handleThemeSelect} />
          </motion.div>
        )}

        {gameState === 'INSTRUCTIONS' && selectedTheme && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex min-h-screen flex-col items-center justify-center p-6 text-center landscape-content"
          >
            <div className="mb-6 rounded-full bg-rose-500/10 p-6">
              <PartyPopper className="h-16 w-16 text-rose-500" />
            </div>
            <h2 className="mb-4 text-5xl font-black uppercase italic text-white md:text-7xl">
              {t.ready[language]}
            </h2>
            <p className="mb-10 max-w-2xl text-xl font-bold text-slate-400 md:text-2xl">
              {t.instructions[language]}
            </p>
            <button
              onClick={startPlaying}
              className="group relative flex items-center gap-4 rounded-full bg-rose-500 px-12 py-6 text-2xl font-black text-white shadow-2xl shadow-rose-500/40 transition-all hover:bg-rose-400 hover:scale-110 active:scale-95"
            >
              {t.start[language]}
            </button>
          </motion.div>
        )}

        {gameState === 'PLAYING' && selectedTheme && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <GameScreen
              theme={selectedTheme}
              lang={language}
              onFinish={handleGameFinish}
            />
          </motion.div>
        )}

        {gameState === 'RESULTS' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsScreen
              score={lastScore}
              lang={language}
              onRestart={replayTheme}
              onHome={resetGame}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

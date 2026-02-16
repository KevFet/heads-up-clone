
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
    toggleFullScreen();
    setSelectedTheme(theme);
    setLanguage(lang);
    setGameState('INSTRUCTIONS');
  };



  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    }
  };

  const startPlaying = () => {
    toggleFullScreen();
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
      en: 'Swipe RIGHT if correct, Swipe LEFT to pass.',
      fr: 'Swippe à DROITE si correct, à GAUCHE pour passer.',
      'es-MX': 'Desliza a la DERECHA si es correcto, a la IZQUIERDA para pasar.'
    },

    start: { en: 'START', fr: 'COMMENCER', 'es-MX': 'EMPEZAR' }
  };


  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-rose-500/30 overflow-hidden">
      <LandscapeWarning />

      <AnimatePresence mode="wait">
        {gameState === 'LOBBY' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="landscape-content-hidden h-full"
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
            className="flex min-h-screen flex-col items-center justify-center p-4 text-center landscape-content-hidden overflow-y-auto"
          >
            <div className="mb-2 rounded-full bg-rose-500/10 p-3">
              <PartyPopper className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="mb-2 text-3xl font-black uppercase italic text-white md:text-6xl">
              {t.ready[language]}
            </h2>
            <p className="mb-6 max-w-2xl text-base font-bold text-slate-400 md:text-xl px-4">
              {t.instructions[language]}
            </p>
            <button
              onClick={startPlaying}
              className="group relative flex items-center gap-3 rounded-full bg-rose-500 px-8 py-3 text-lg font-black text-white shadow-2xl shadow-rose-500/40 transition-all hover:bg-rose-400 hover:scale-110 active:scale-95"
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
            className="fixed inset-0 z-50 landscape-content-hidden"
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
            className="landscape-content-hidden"
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

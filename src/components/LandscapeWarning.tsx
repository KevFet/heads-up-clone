
'use client';

import { Smartphone } from 'lucide-react';

export default function LandscapeWarning() {
    return (
        <div className="portrait-only fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 p-8 text-center text-white">
            <div className="mb-6 animate-bounce">
                <Smartphone className="h-20 w-20 rotate-90" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Please Rotate Your Phone</h2>
            <p className="text-slate-400">This game is best played in landscape mode (sideways).</p>
        </div>
    );
}

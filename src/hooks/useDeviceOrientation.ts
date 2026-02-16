
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type TiltDirection = 'neutral' | 'up' | 'down';

export function useDeviceOrientation() {
    const [orientation, setOrientation] = useState<{ beta: number | null; gamma: number | null }>({
        beta: null,
        gamma: null,
    });
    const [tilt, setTilt] = useState<TiltDirection>('neutral');
    const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');

    const requestPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const result = await (DeviceOrientationEvent as any).requestPermission();
                setPermission(result);
                return result === 'granted';
            } catch (error) {
                console.error('Permission request failed', error);
                setPermission('denied');
                return false;
            }
        }
        setPermission('granted');
        return true;
    };

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        const { beta, gamma } = event;
        setOrientation({ beta, gamma });

        // In Landscape mode (Heads Up):
        // On many devices, 'gamma' handles the tilt forward/backward 
        // when the phone is held horizontal (landscape).
        // On others, 'beta' still does it but with offset.

        // We want to detect a "flick" or significant tilt.
        // Neutral: Phone is vertical (gamma near 0 or beta near 90/270).

        // Logic: Look at both. 
        // If either shows a strong tilt Down or Up, we trigger it.

        let currentTilt: TiltDirection = 'neutral';

        // Check Beta (Tilting forward/back in portrait, but maybe sides in landscape)
        // However, some browsers normalize. 
        // Let's use a simpler logic: 
        // If phone is flat-ish (screen facing ground) -> Correct
        // If phone is flat-ish (screen facing sky) -> Pass

        if (beta !== null && gamma !== null) {
            // Gamma is -90 to 90. In landscape, 0 is vertical.
            // -90 is one side down, 90 is other side down.
            // Wait, if it's on the forehead:
            // Tilting forward (top to ground) usually makes Gamma go towards one extreme.

            // Beta check:
            const b = Math.abs(beta);
            const g = Math.abs(gamma);

            // Detect "Flat" (Down) or "Face Up" (Up)
            // If beta is small (< 30) or large (> 150) -> Tilt
            if (b < 35) {
                currentTilt = 'down';
            } else if (b > 145) {
                currentTilt = 'up';
            } else if (b > 70 && b < 110) {
                currentTilt = 'neutral';
            }

            // Backup check with Gamma (some devices swap these in landscape)
            if (currentTilt === 'neutral') {
                if (g > 60) {
                    // If gamma is very high, it depends on which landscape side we are on.
                    // But for "Heads Up", any extreme gamma usually means a tilt.
                    // We'll stick to Beta for now but broaden the neutral zone.
                }
            }
        }

        setTilt(currentTilt);
    }, []);

    useEffect(() => {
        if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [permission, handleOrientation]);

    return { orientation, tilt, permission, requestPermission };
}

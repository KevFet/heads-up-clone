
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
        let { beta, gamma } = event;
        setOrientation({ beta, gamma });

        // Heads Up Logic for Landscape:
        // When the phone is in landscape, "beta" and "gamma" can swap or behave differently.
        // However, for most browsers, "beta" is the rotation around the X-axis (tilting forward/back).

        if (beta !== null && gamma !== null) {
            // Normalize beta for different landscape orientations if necessary
            // But usually, beta < 45 is "Face Down", beta > 135 is "Face Up"
            // Neutral is around 90.

            const absBeta = Math.abs(beta);

            // If we are in landscape, we might need to check gamma if the phone is held vertically.
            // But usually beta is reliable for "tilt forward/back".

            if (absBeta < 40) {
                setTilt('down');
            } else if (absBeta > 140) {
                setTilt('up');
            } else if (absBeta > 70 && absBeta < 110) {
                setTilt('neutral');
            }
        }
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

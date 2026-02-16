
'use client';

import { useState, useEffect, useCallback } from 'react';

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

        if (beta !== null) {
            // Assuming 90 is vertical (on forehead)
            // Tilt Down (Forward) -> beta decreases towards 0
            // Tilt Up (Backward) -> beta increases towards 180
            if (beta < 40) setTilt('down');
            else if (beta > 140) setTilt('up');
            else if (beta > 70 && beta < 110) setTilt('neutral');
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

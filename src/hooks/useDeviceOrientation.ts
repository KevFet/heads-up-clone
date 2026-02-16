
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

        // calibration: 
        // In landscape, we care about how the phone rotates around its long axis.
        // Usually 'beta' or 'gamma' depending on screen orientation.
        // For "Heads Up", if the screen is on the forehead:
        // Tilt Down (Forward) = Top of phone moves towards the ground.
        // Tilt Up (Backward) = Top of phone moves towards the sky.

        // We'll use a threshold of 45 degrees.
        // Note: These values can be tricky depending on the browser/OS.
        // Simplified logic: 
        if (beta !== null) {
            if (beta > 60) setTilt('down');
            else if (beta < -60) setTilt('up');
            else setTilt('neutral');
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

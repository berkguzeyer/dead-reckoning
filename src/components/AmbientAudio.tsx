import { useState, useRef, useCallback, useEffect } from 'react';
import styles from '../styles/AmbientAudio.module.css';

export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gains: GainNode[] } | null>(null);

  const createAmbience = useCallback(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const gains: GainNode[] = [];

    // Wind noise — filtered white noise
    const windBufferSize = 2 * ctx.sampleRate;
    const windBuffer = ctx.createBuffer(1, windBufferSize, ctx.sampleRate);
    const windData = windBuffer.getChannelData(0);
    for (let i = 0; i < windBufferSize; i++) {
      windData[i] = Math.random() * 2 - 1;
    }
    const windSource = ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 400;
    windFilter.Q.value = 1;

    // LFO for wind variation
    const windLFO = ctx.createOscillator();
    const windLFOGain = ctx.createGain();
    windLFO.frequency.value = 0.15;
    windLFOGain.gain.value = 100;
    windLFO.connect(windLFOGain);
    windLFOGain.connect(windFilter.frequency);
    windLFO.start();

    const windGain = ctx.createGain();
    windGain.gain.value = 0.06;
    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(ctx.destination);
    windSource.start();
    gains.push(windGain);

    // Distant digging — periodic low thuds
    const createThud = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

      const osc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      osc.frequency.value = 60 + Math.random() * 30;
      osc.type = 'sine';
      thudGain.gain.setValueAtTime(0.03, ctx.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(thudGain);
      thudGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);

      // Random interval between thuds
      setTimeout(createThud, 2000 + Math.random() * 5000);
    };
    setTimeout(createThud, 1000);

    // Subtle high-pitched ambient tone (like distant metal)
    const toneOsc = ctx.createOscillator();
    const toneGain = ctx.createGain();
    toneOsc.frequency.value = 2400;
    toneOsc.type = 'sine';
    toneGain.gain.value = 0.003;
    toneOsc.connect(toneGain);
    toneGain.connect(ctx.destination);
    toneOsc.start();
    gains.push(toneGain);

    nodesRef.current = { gains };
  }, []);

  const toggle = () => {
    if (playing) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setPlaying(false);
    } else {
      createAmbience();
      setPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      className={`${styles.toggle} ${playing ? styles.active : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Mute ambient audio' : 'Play ambient audio'}
      title="Field Radio"
    >
      <svg viewBox="0 0 24 24" className={styles.icon}>
        {playing ? (
          <>
            <rect x="3" y="6" width="4" height="12" rx="1" fill="currentColor" />
            <path d="M7 8 L13 4 L13 20 L7 16Z" fill="currentColor" />
            <path d="M16 8 Q20 12 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M18 5 Q24 12 18 19" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <rect x="3" y="6" width="4" height="12" rx="1" fill="currentColor" />
            <path d="M7 8 L13 4 L13 20 L7 16Z" fill="currentColor" />
            <line x1="17" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="22" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" />
          </>
        )}
      </svg>
      <span className={styles.label}>FIELD RADIO</span>
    </button>
  );
}

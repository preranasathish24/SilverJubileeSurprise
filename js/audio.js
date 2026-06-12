/* =============================================================================
   SILVER JUBILEE — Sound Effects (Web Audio, zero external files)
   -----------------------------------------------------------------------------
   These are synthesised placeholder SFX so the magic is audible during the
   prototype. In production, real narration + era music load via Howler.js
   (see README). A mute toggle controls everything.
   ========================================================================== */
const SJ_Audio = (() => {
  let ctx = null;
  let muted = false;
  let ambientGain = null;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, t0, dur, type, peak) {
    if (muted || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak || 0.18, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  /* wand swirl — quick ascending sparkle arpeggio */
  function sparkle() {
    ensure(); if (muted) return;
    const base = ctx.currentTime;
    [880, 1175, 1568, 2093, 2637].forEach((f, i) => tone(f, base + i * 0.05, 0.25, 'triangle', 0.12));
  }

  /* film reel spin — rapid mechanical clicks that slow to a stop */
  function reel(dur = 1.0) {
    ensure(); if (muted) return;
    const base = ctx.currentTime;
    let t = 0, gap = 0.03;
    while (t < dur) {
      tone(140 + Math.random() * 40, base + t, 0.02, 'square', 0.06);
      gap *= 1.06;            // gradually slow → "reel winding down"
      t += gap;
    }
    tone(90, base + dur, 0.18, 'sine', 0.1); // soft thunk as it stops
  }

  /* gift box open — warm ascending chime */
  function chime() {
    ensure(); if (muted) return;
    const base = ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, base + i * 0.09, 0.6, 'sine', 0.16));
  }

  /* soft two-note bell — "the wand is ready", quieter than the gift chime */
  function glimmer() {
    ensure(); if (muted) return;
    const base = ctx.currentTime;
    tone(1318.5, base, 0.5, 'sine', 0.07);
    tone(1760, base + 0.12, 0.6, 'sine', 0.05);
  }

  /* paper note whoosh for wishes wall */
  function whoosh() {
    ensure(); if (muted || !ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    const t0 = ctx.currentTime;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(600, t0);
    o.frequency.exponentialRampToValueAtTime(180, t0 + 0.3);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
    o.connect(g).connect(ctx.destination);
    o.start(t0); o.stop(t0 + 0.34);
  }

  /* soft cinematic pad under the chapters (stands in for era music) */
  function ambient(on) {
    ensure();
    if (on) {
      if (ambientGain) return;
      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(muted ? 0.0001 : 0.04, ctx.currentTime + 1.2);
      [110, 165, 220].forEach(f => {
        const o = ctx.createOscillator();
        o.type = 'sine'; o.frequency.value = f;
        const og = ctx.createGain(); og.gain.value = 0.33;
        o.connect(og).connect(ambientGain);
        o.start();
      });
      ambientGain.connect(ctx.destination);
    } else if (ambientGain) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      const g = ambientGain; ambientGain = null;
      setTimeout(() => g.disconnect(), 1000);
    }
  }

  /* =========================================================================
     GENERATIVE SCORE — an original, evolving cinematic bed (no external files).
     Slow pad chords (Am–F–C–G) + a sparse pentatonic bell melody. A "warmth"
     value (0 = B&W prologue → 1 = golden finale) opens the brightness, lifts the
     register and thickens the texture, so the music grows with the story instead
     of one constant loop. Drop-in media/music/background.* still overrides this.
     ====================================================================== */
  let scoreOn = false, scorePaused = false, ducked = false;
  let musicBus = null, padLP = null, reverbIn = null, schedTimer = null;
  let warmth = 0, warmthTarget = 0, chordIx = 0, nextChordT = 0, nextMelT = 0;
  const MUSIC_BASE = 0.17;
  // chord voicings (Hz): Am · F · C · G — smooth, shared tones
  const CHORDS = [
    [110.00, 164.81, 220.00, 261.63],
    [ 87.31, 130.81, 174.61, 220.00],
    [130.81, 196.00, 261.63, 329.63],
    [ 98.00, 146.83, 196.00, 246.94],
  ];
  // Carnatic ragas over Sa = C: Shivaranjani (wistful, komal Ga) for the early years,
  // brightening to Mohanam (auspicious, major) as the story warms toward the finale.
  const RAGA_MINOR = [261.63, 293.66, 311.13, 392.00, 440.00]; // C D Eb G A  (Shivaranjani)
  const RAGA_MAJOR = [261.63, 293.66, 329.63, 392.00, 440.00]; // C D E  G A  (Mohanam)
  const DRONE = [98.00, 130.81, 130.81, 65.41];               // tanpura cycle: Pa · Sa · Sa · Sa
  let nextDroneT = 0, droneIx = 0;

  function musicTarget() {
    if (muted || scorePaused) return 0.0001;
    return Math.max(0.0001, ducked ? MUSIC_BASE * 0.30 : MUSIC_BASE);
  }
  function applyMusicGain(ramp = 0.6) {
    if (musicBus && ctx) musicBus.gain.exponentialRampToValueAtTime(musicTarget(), ctx.currentTime + ramp);
  }

  function padChord(freqs, t0, dur) {
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i % 2 ? 'triangle' : 'sine';
      o.frequency.value = f; o.detune.value = Math.random() * 7 - 3.5;
      const g = ctx.createGain(); const peak = 0.052 / Math.sqrt(freqs.length);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 2.3);          // slow swell
      g.gain.setValueAtTime(peak, t0 + Math.max(2.4, dur - 2.6));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);        // slow release
      o.connect(g).connect(padLP);
      o.start(t0); o.stop(t0 + dur + 0.1);
    });
    if (warmth > 0.45) {                                            // a shimmer octave when warm
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.value = freqs[freqs.length - 1] * 2;
      const g = ctx.createGain(); const peak = 0.018 * (warmth - 0.4);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + 2.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(musicBus);
      o.start(t0); o.stop(t0 + dur + 0.1);
    }
  }
  function flute(f, t0) {                                           // bansuri-like: gamaka slide + vibrato
    const from = Math.random() < 0.6 ? f * 0.945 : f;              // slide up into the note (gamaka)
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(from, t0); o.frequency.exponentialRampToValueAtTime(f, t0 + 0.14);
    const o2 = ctx.createOscillator(); o2.type = 'triangle';
    o2.frequency.setValueAtTime(from, t0); o2.frequency.exponentialRampToValueAtTime(f, t0 + 0.14);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 5.2; // vibrato
    const lg = ctx.createGain(); lg.gain.value = f * 0.006; lfo.connect(lg); lg.connect(o.frequency);
    const g2 = ctx.createGain(); g2.gain.value = 0.22;
    const g = ctx.createGain(); const peak = 0.05;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.09);
    g.gain.setValueAtTime(peak, t0 + 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.2);          // breathy decay
    o.connect(g); o2.connect(g2).connect(g);
    g.connect(musicBus); g.connect(reverbIn);
    o.start(t0); o.stop(t0 + 2.3); o2.start(t0); o2.stop(t0 + 2.3); lfo.start(t0); lfo.stop(t0 + 2.3);
  }
  function pluck(f, t0) {                                           // tanpura string (Sa / Pa anchor)
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = f;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100;
    const g2 = ctx.createGain(); g2.gain.value = 0.12;
    const g = ctx.createGain(); const peak = 0.045;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5);          // resonant string decay
    o.connect(g); o2.connect(g2).connect(lp).connect(g);
    g.connect(musicBus); g.connect(reverbIn);
    o.start(t0); o.stop(t0 + 1.6); o2.start(t0); o2.stop(t0 + 1.6);
  }
  function pickNote() {
    const scale = warmth < 0.5 ? RAGA_MINOR : RAGA_MAJOR;
    let f = scale[Math.floor(Math.random() * scale.length)] * 2;   // flute octave
    if (warmth > 0.6 && Math.random() < warmth - 0.4) f *= 2;       // soar higher when warm
    else if (warmth < 0.25 && Math.random() < 0.5) f *= 0.5;        // lower/darker in the prologue
    return f;
  }
  function scheduler() {
    if (!scoreOn || scorePaused || !ctx) return;
    warmth += (warmthTarget - warmth) * 0.06;
    if (padLP) padLP.frequency.setTargetAtTime(600 + warmth * 4600, ctx.currentTime, 0.6);
    const ahead = ctx.currentTime + 0.7, CHORD_DUR = 7.6;
    while (nextChordT < ahead) {
      padChord(CHORDS[chordIx % CHORDS.length], nextChordT, CHORD_DUR + 1.0);
      chordIx++; nextChordT += CHORD_DUR;
    }
    while (nextDroneT < ahead) {                                    // steady tanpura pulse
      pluck(DRONE[droneIx % DRONE.length], nextDroneT);
      droneIx++; nextDroneT += 1.05;
    }
    const gap = 2.4 - warmth * 1.1, density = 0.5 + warmth * 0.4;
    while (nextMelT < ahead) {
      if (!muted && Math.random() < density) flute(pickNote(), nextMelT);
      nextMelT += gap * (0.85 + Math.random() * 0.5);
    }
  }
  function scoreStart() {
    ensure(); if (scoreOn) return; scoreOn = true; scorePaused = false;
    musicBus = ctx.createGain(); musicBus.gain.value = 0.0001; musicBus.connect(ctx.destination);
    padLP = ctx.createBiquadFilter(); padLP.type = 'lowpass'; padLP.frequency.value = 650; padLP.Q.value = 0.4;
    padLP.connect(musicBus);
    const delay = ctx.createDelay(1.0); delay.delayTime.value = 0.26;
    const fb = ctx.createGain(); fb.gain.value = 0.34;
    const damp = ctx.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 2600;
    reverbIn = ctx.createGain(); reverbIn.gain.value = 0.5;
    reverbIn.connect(delay); delay.connect(damp); damp.connect(fb); fb.connect(delay); damp.connect(musicBus);
    nextChordT = ctx.currentTime + 0.15; nextMelT = ctx.currentTime + 1.6;
    nextDroneT = ctx.currentTime + 0.2; chordIx = 0; droneIx = 0;
    scheduler();
    schedTimer = setInterval(scheduler, 250);
    applyMusicGain(2.6);
  }
  function scoreStop() {
    scoreOn = false; clearInterval(schedTimer);
    if (musicBus && ctx) { const b = musicBus; b.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0); setTimeout(() => b.disconnect(), 1200); }
    musicBus = null;
  }
  function scoreWarmth(w) { warmthTarget = Math.max(0, Math.min(1, w)); }
  function scoreDuck(on) { ducked = on; applyMusicGain(); }
  function scorePause() { scorePaused = true; applyMusicGain(0.5); }
  function scoreResume() { if (!scoreOn) return; scorePaused = false; nextChordT = ctx.currentTime + 0.1; nextMelT = ctx.currentTime + 0.5; nextDroneT = ctx.currentTime + 0.1; applyMusicGain(1.2); }

  function setMuted(m) {
    muted = m;
    if (ambientGain && ctx) {
      ambientGain.gain.exponentialRampToValueAtTime(m ? 0.0001 : 0.04, ctx.currentTime + 0.3);
    }
    applyMusicGain(0.4);
  }

  return {
    unlock: ensure, sparkle, reel, chime, glimmer, whoosh, ambient, setMuted, isMuted: () => muted,
    scoreStart, scoreStop, scoreWarmth, scoreDuck, scorePause, scoreResume, isScoring: () => scoreOn,
  };
})();
window.SJ_Audio = SJ_Audio;

// Studio-grade Web Audio API acoustic feedback engine for EL SULTAN
// Production policy:
// - Muted (OFF) by default on page load
// - AudioContext is created and unlocked ONLY on an explicit user gesture (toggling sound ON)
// - Gracefully recovers from autoplay, Safari/iOS, or missing Web Audio API failures
// - Respects prefers-reduced-motion automatically

type Listener = (muted: boolean) => void;

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted: boolean = true;
  private armed: boolean = false;
  private listeners = new Set<Listener>();

  private lastTickTime = 0;
  private lastScrollDetentTime = 0;
  private lastScrollY = 0;
  private scrollDistanceAccumulator = 0;
  private lastChapterTime = 0;
  private lastChapterId = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.lastScrollY = window.scrollY;
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.muted ? 0 : 0.85;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {
          // Recover silently if browser blocks audio playback
        });
      }
      this.armed = true;
      return this.ctx;
    } catch {
      return null;
    }
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isEnabled(): boolean {
    return !this.muted;
  }

  public setMuted(nextMuted: boolean): boolean {
    this.muted = nextMuted;
    if (!nextMuted) {
      const ctx = this.ensureContext();
      if (this.masterGain && ctx) {
        try {
          this.masterGain.gain.setTargetAtTime(0.85, ctx.currentTime, 0.02);
        } catch {
          // Ignore Web Audio parameter edge cases
        }
      }
      this.playConfirm();
    } else if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02);
      } catch {
        // Ignore
      }
    }
    this.listeners.forEach((fn) => fn(this.muted));
    return this.muted;
  }

  public toggle(): boolean {
    return this.setMuted(!this.muted);
  }

  private canPlay(): boolean {
    if (this.muted || !this.armed) return false;
    if (typeof window !== 'undefined') {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (reduced) return false;
    }
    return true;
  }

  /**
   * Tactile damped UI tap — warm low-mid thud + crisp filtered transient (~20ms)
   */
  public playClick() {
    if (!this.canPlay()) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain || ctx.state !== 'running') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(78, now + 0.024);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, now);

      bodyGain.gain.setValueAtTime(0.001, now);
      bodyGain.gain.linearRampToValueAtTime(0.075, now + 0.002);
      bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.028);

      osc.connect(filter);
      filter.connect(bodyGain);
      bodyGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.032);
    } catch {
      // Ignore audio policy edge cases
    }
  }

  public playPop() {
    this.playConfirm();
  }

  /**
   * Rich primary action / dish selection resonance (D4 + soft A4 fifth shimmer)
   */
  public playConfirm() {
    if (!this.canPlay()) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain || ctx.state !== 'running') return;
      const now = ctx.currentTime;

      const freqs = [293.66, 440];
      freqs.forEach((f, idx) => {
        if (!this.masterGain) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.028);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        const peak = idx === 0 ? 0.045 : 0.032;
        const t0 = now + idx * 0.028;
        gain.gain.setValueAtTime(0.0005, t0);
        gain.gain.linearRampToValueAtTime(peak, t0 + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0005, t0 + 0.14);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t0);
        osc.stop(t0 + 0.15);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Whisper-quiet feather detent on hover/filter sweep
   */
  public playTick() {
    if (!this.canPlay()) return;
    const nowMs = performance.now();
    if (nowMs - this.lastTickTime < 55) return;
    this.lastTickTime = nowMs;

    try {
      const ctx = this.ctx;
      if (!ctx || !this.masterGain || ctx.state !== 'running') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.01);

      gain.gain.setValueAtTime(0.0005, now);
      gain.gain.linearRampToValueAtTime(0.016, now + 0.0015);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.014);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.016);
    } catch {
      // Ignore
    }
  }

  /**
   * Subtle magnetic scroll notch — triggers smoothly per ~180px of scroll travel when sound is enabled
   */
  public handleScroll(scrollY: number, maxScroll: number) {
    if (this.muted || !this.armed) {
      this.lastScrollY = scrollY;
      return;
    }

    const delta = Math.abs(scrollY - this.lastScrollY);
    this.lastScrollY = scrollY;
    if (delta <= 0) return;

    this.scrollDistanceAccumulator += delta;
    if (this.scrollDistanceAccumulator < 180) return;
    this.scrollDistanceAccumulator = 0;

    if (!this.canPlay()) return;
    const nowMs = performance.now();
    if (nowMs - this.lastScrollDetentTime < 90) return;
    this.lastScrollDetentTime = nowMs;

    try {
      const ctx = this.ctx;
      if (!ctx || !this.masterGain || ctx.state !== 'running') return;
      const now = ctx.currentTime;

      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      const baseFreq = 440 + progress * 240;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.62, now + 0.016);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.15, now);
      filter.Q.value = 1.8;

      gain.gain.setValueAtTime(0.0005, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.024);
    } catch {
      // Ignore
    }
  }

  /**
   * Subtle acoustic harmonic when navigating between pages (only when sound is enabled)
   */
  public playChapterEnter(chapterId: string, index: number) {
    if (chapterId === this.lastChapterId) return;
    this.lastChapterId = chapterId;

    if (!this.canPlay()) return;
    const nowMs = performance.now();
    if (nowMs - this.lastChapterTime < 650) return;
    this.lastChapterTime = nowMs;

    try {
      const ctx = this.ctx;
      if (!ctx || !this.masterGain || ctx.state !== 'running') return;
      const now = ctx.currentTime;

      const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
      const freq = scale[index % scale.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      gain.gain.setValueAtTime(0.0004, now);
      gain.gain.linearRampToValueAtTime(0.024, now + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.0004, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();

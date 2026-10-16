/**
 * Ambient Synthesizer & Notification Chimes via Web Audio API
 * Generates pleasant lofi chimes, relaxing ambient warmth, and sprint transition chimes
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  public isAmbientPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft chime for checkmarks and kudos
  playChime(type: 'success' | 'click' | 'kudos' | 'transition') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'kudos') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'transition') {
        // Limbic 45-min ultradian phase change chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        osc.frequency.setValueAtTime(659.25, now + 0.3);
        osc.frequency.setValueAtTime(880, now + 0.45);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.start(now);
        osc.stop(now + 0.95);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch {
      // AudioContext unavailable in silent headless environment
    }
  }

  toggleAmbient(force?: boolean): boolean {
    try {
      this.initCtx();
      if (!this.ctx) return false;

      const shouldPlay = force !== undefined ? force : !this.isAmbientPlaying;

      if (!shouldPlay && this.ambientOsc) {
        this.ambientGain?.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.1);
        setTimeout(() => {
          this.ambientOsc?.stop();
          this.ambientOsc?.disconnect();
          this.ambientOsc = null;
          this.ambientGain = null;
          this.isAmbientPlaying = false;
        }, 200);
        return false;
      }

      if (shouldPlay && !this.ambientOsc) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(174.61, this.ctx.currentTime); // F3 healing frequency vibe

        // gentle vibrato lfo
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 0.2Hz wave
        lfoGain.gain.setValueAtTime(2.5, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();

        this.ambientOsc = osc;
        this.ambientGain = gain;
        this.isAmbientPlaying = true;
        return true;
      }

      return this.isAmbientPlaying;
    } catch {
      return false;
    }
  }
}

export const soundEngine = new SoundEngine();

export interface AudioManagerOptions {
  basePath: string; // path relative to this module for asset URLs
  successFile: string;
  failFile: string;
  defaultVolume?: number;
  backgroundFile?: string;
  backgroundVolume?: number;
}

export class AudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private backgroundAudio: HTMLAudioElement | null = null;
  private options: AudioManagerOptions;
  private muted = false;

  constructor(options: AudioManagerOptions) {
    this.options = options;
  }

  async playWord(word: string): Promise<void> {
    const fileName = `${this.sanitize(word)}.mp3`;
    await this.play(this.getSrc(fileName));
  }

  async playSuccess(): Promise<void> {
    await this.play(this.getSrc(this.options.successFile));
  }

  async playFail(): Promise<void> {
    await this.play(this.getSrc(this.options.failFile));
  }

  async startBackground(): Promise<void> {
    if (!this.options.backgroundFile) return;
    if (!this.backgroundAudio) {
      this.backgroundAudio = new Audio(this.getSrc(this.options.backgroundFile));
      this.backgroundAudio.loop = true;
      this.backgroundAudio.muted = this.muted;
      if (this.options.backgroundVolume !== undefined) {
        this.backgroundAudio.volume = this.options.backgroundVolume;
      }
    }
    try {
      await this.backgroundAudio.play();
    } catch (error) {
      console.error('Background audio playback failed', error);
    }
  }

  setBackgroundVolume(volume: number): void {
    if (this.backgroundAudio) {
      this.backgroundAudio.volume = volume;
    }
  }

  stopBackground(): void {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
      this.backgroundAudio = null;
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  toggleMute(): void {
    this.muted = !this.muted;
    if (this.currentAudio) {
      this.currentAudio.muted = this.muted;
    }
    if (this.backgroundAudio) {
      this.backgroundAudio.muted = this.muted;
    }
  }

  private sanitize(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }

  private getSrc(fileName: string): string {
    return new URL(`${this.options.basePath}/${fileName}`, import.meta.url).toString();
  }

  private async play(src: string): Promise<void> {
    this.stop();
    this.currentAudio = new Audio(src);
    this.currentAudio.muted = this.muted;
    if (this.options.defaultVolume !== undefined) {
      this.currentAudio.volume = this.options.defaultVolume;
    }
    try {
      await this.currentAudio.play();
    } catch (error) {
      console.error('Audio playback failed', error);
    }
  }
}

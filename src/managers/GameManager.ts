import { words as topicsWords } from '../data/words';
import { TopicKey, WordTopics, GameState } from '../types/game';
import { AudioManager } from './AudioManager';
import { UIManager } from './UIManager';

export class GameManager {
  private state: GameState = {
    topic: null,
    currentWord: null,
    wordIndex: 0,
    wordsQueue: []
  };

  constructor(
    private topics: WordTopics,
    private ui: UIManager,
    private audio: AudioManager
  ) {
    this.registerHandlers();
  }

  start(): void {
    const availableTopics: TopicKey[] = ['fruits', 'career', 'random'];
    this.setBackgroundMode('menu');
    this.ui.showMenu(availableTopics);
  }

  private registerHandlers(): void {
    this.ui.onTopicSelect = (topic) => this.handleTopicSelect(topic);
    this.ui.onSubmitGuess = (value) => this.handleSubmit(value);
    this.ui.onInputChanged = () => this.clearStatus();
    this.ui.onReplay = () => this.handleReplay();
    this.ui.onHome = () => this.handleHome();
  }

  private handleTopicSelect(topic: TopicKey): void {
    this.state.topic = topic;
    this.state.wordIndex = 0;
    this.state.wordsQueue = this.buildQueue(topic);
    if (!this.state.wordsQueue.length) {
      this.ui.setStatus('No words found for this topic.', 'fail');
      return;
    }
    const first = this.state.wordsQueue[0];
    this.state.currentWord = first;
    this.showGameView();
    this.setBackgroundMode('game');
    this.playCurrentWord();
  }

  private buildQueue(topic: TopicKey): string[] {
    // Preserve the provided ordering; no shuffling.
    return [...this.topics[topic]];
  }

  private showGameView(): void {
    const total = this.state.wordsQueue.length;
    const current = this.state.wordIndex + 1;
    const word = this.state.currentWord ?? '';
    this.ui.showGame(this.state.topic as TopicKey, word.length, `${current}/${total}`);
    this.ui.setWordHint(word);
  }

  private async playCurrentWord(): Promise<void> {
    if (!this.state.currentWord) return;
    await this.audio.playWord(this.state.currentWord);
  }

  private async handleReplay(): Promise<void> {
    if (!this.state.currentWord) return;
    this.ui.setStatus('Replaying audio...', 'idle');
    await this.playCurrentWord();
    this.ui.setStatus('Audio playing. Type what you hear.', 'idle');
  }

  private handleHome(): void {
    this.audio.stop();
    this.setBackgroundMode('menu');
    this.start();
  }

  private async handleSubmit(value: string): Promise<void> {
    if (!this.state.currentWord) return;
    const guess = value.trim().toLowerCase();
    const target = this.state.currentWord.toLowerCase();
    if (!guess) {
      this.ui.setStatus('Type the word first.', 'fail');
      return;
    }

    if (guess === target) {
      void this.audio.playSuccess();
      this.ui.setStatus('Correct! Loading next word...', 'success');
      this.advance();
    } else {
      void this.audio.playFail();
      this.ui.setStatus('Incorrect. Try again.', 'fail');
    }
  }

  private advance(): void {
    this.state.wordIndex += 1;
    if (this.state.wordIndex >= this.state.wordsQueue.length) {
      this.state.currentWord = null;
      this.ui.showCongrats(this.state.topic as TopicKey);
      this.setBackgroundMode('congrats');
      return;
    }
    this.state.currentWord = this.state.wordsQueue[this.state.wordIndex];
    this.showGameView();
    this.playCurrentWord();
  }

  private clearStatus(): void {
    this.ui.setStatus('Keep typing.', 'idle');
  }

  private setBackgroundMode(mode: 'menu' | 'game' | 'congrats'): void {
    const volumes: Record<'menu' | 'game' | 'congrats', number> = {
      menu: 0.32,
      game: 0.08,
      congrats: 0.26
    };
    void this.audio.startBackground();
    this.audio.setBackgroundVolume(volumes[mode]);
  }

  private shuffle(list: string[]): string[] {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

// Default export for convenience when importing without destructuring
export default function createGameManager(
  ui: UIManager,
  audio: AudioManager,
  topics: WordTopics = topicsWords
): GameManager {
  return new GameManager(topics, ui, audio);
}

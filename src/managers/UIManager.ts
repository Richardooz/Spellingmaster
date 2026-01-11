import styles from '../styles/app.module.css';
import { TopicKey } from '../types/game';

type TopicSelectHandler = (topic: TopicKey) => void;
type SubmitHandler = (value: string) => void;
type InputChangeHandler = (value: string) => void;
type ReplayHandler = () => void;
type HomeHandler = () => void;

export class UIManager {
  onTopicSelect?: TopicSelectHandler;
  onSubmitGuess?: SubmitHandler;
  onInputChanged?: InputChangeHandler;
  onReplay?: ReplayHandler;
  onHome?: HomeHandler;

  private homeSection: HTMLDivElement;
  private topicSection: HTMLDivElement;
  private gameSection: HTMLDivElement;
  private inputEl!: HTMLInputElement;
  private statusEl!: HTMLDivElement;
  private topicTitle!: HTMLDivElement;

  constructor(private root: HTMLElement) {
    this.root.classList.add(styles.app);

    this.homeSection = this.buildHome();
    this.topicSection = this.buildTopic();
    this.gameSection = this.buildGame();

    this.root.appendChild(this.homeSection);
    this.root.appendChild(this.topicSection);
    this.root.appendChild(this.gameSection);

    this.setScreen('home');
  }

  showMenu(topics: TopicKey[]): void {
    this.renderTopics(topics);
    this.setScreen('home');
    this.setStatus('Pilih topik untuk mulai.', 'idle');
  }

  showGame(topic: TopicKey, _length: number, _progress: string): void {
    this.setScreen('game');
    this.topicTitle.textContent = `Topic: ${topic.toUpperCase()}`;
    this.setInput('');
    this.focusInput();
    this.setStatus('Dengarkan dan ketik kata.', 'idle');
  }

  setWordHint(word: string): void {
    const mask = Array.from(word).map(() => ' _ ').join('');
    this.statusEl.textContent = mask;
  }

  setInput(value: string): void {
    this.inputEl.value = value;
    this.onInputChanged?.(this.inputEl.value);
  }

  backspace(): void {
    this.inputEl.value = this.inputEl.value.slice(0, -1);
    this.onInputChanged?.(this.inputEl.value);
  }

  focusInput(): void {
    this.inputEl.focus();
  }

  setStatus(message: string, state: 'success' | 'fail' | 'idle'): void {
    this.statusEl.textContent = message;
    this.statusEl.className = `${styles.status} ${
      state === 'success'
        ? styles.statusSuccess
        : state === 'fail'
        ? styles.statusFail
        : ''
    }`;
  }

  private buildHome(): HTMLDivElement {
    const section = document.createElement('div');
    section.className = `${styles.screen} ${styles.home}`;

    const logo = document.createElement('img');
    logo.className = styles.logoImg;
    logo.alt = 'Spelling Master';
    logo.src = new URL('../assets/images/logo-spellingmaster.png', import.meta.url).toString();

    const playBtn = document.createElement('button');
    playBtn.className = styles.playButton;
    playBtn.type = 'button';
    playBtn.title = 'Play';
    playBtn.addEventListener('click', () => this.setScreen('topic'));

    section.appendChild(logo);
    section.appendChild(playBtn);
    return section;
  }

  private buildTopic(): HTMLDivElement {
    const section = document.createElement('div');
    section.className = `${styles.screen} ${styles.topic}`;

    const title = document.createElement('div');
    title.className = styles.topicTitle;
    title.textContent = 'CHOOSE TOPIC';

    const buttonsWrap = document.createElement('div');
    buttonsWrap.className = styles.topicButtons;
    buttonsWrap.dataset.section = 'topic-buttons';

    section.appendChild(title);
    section.appendChild(buttonsWrap);
    return section;
  }

  private buildGame(): HTMLDivElement {
    const section = document.createElement('div');
    section.className = `${styles.screen} ${styles.game}`;

    const backBtn = document.createElement('button');
    backBtn.className = `${styles.iconButton} ${styles.iconHome}`;
    backBtn.type = 'button';
    backBtn.addEventListener('click', () => this.onHome?.());

    backBtn.id = 'back-btn';
    section.appendChild(backBtn);

    const center = document.createElement('div');
    center.className = styles.gameCenter;

    const replayBtn = document.createElement('button');
    replayBtn.className = `${styles.iconButton} ${styles.iconVolume}`;
    replayBtn.type = 'button';
    replayBtn.addEventListener('click', () => this.onReplay?.());

    this.topicTitle = document.createElement('div');
    this.topicTitle.className = styles.topicLabel;
    this.topicTitle.textContent = 'Topic';

    this.inputEl = document.createElement('input');
    this.inputEl.className = styles.textInput;
    this.inputEl.type = 'text';
    this.inputEl.placeholder = 'Ketik jawaban';

    center.appendChild(this.topicTitle);
    center.appendChild(replayBtn);
    center.appendChild(this.inputEl);

    this.statusEl = document.createElement('div');
    this.statusEl.className = styles.status;
    this.statusEl.textContent = '';
    center.appendChild(this.statusEl);

    const bottom = document.createElement('div');
    bottom.className = styles.gameBottom;

    const clearBtn = document.createElement('button');
    clearBtn.className = `${styles.iconButton} ${styles.iconHapus}`;
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', () => this.setInput(''));

    const submitBtn = document.createElement('button');
    submitBtn.className = `${styles.iconButton} ${styles.iconKirim}`;
    submitBtn.type = 'button';
    submitBtn.addEventListener('click', () => this.onSubmitGuess?.(this.inputEl.value));

    bottom.appendChild(clearBtn);
    bottom.appendChild(submitBtn);

    section.appendChild(center);
    section.appendChild(bottom);

    this.inputEl.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        this.onSubmitGuess?.(this.inputEl.value);
      }
      if (evt.key === 'Escape') {
        this.onHome?.();
      }
    });

    this.inputEl.addEventListener('input', () => this.onInputChanged?.(this.inputEl.value));

    return section;
  }

  private renderTopics(topics: TopicKey[]): void {
    const container = this.topicSection.querySelector('[data-section="topic-buttons"]');
    if (!container) return;
    container.innerHTML = '';

    const topicLabels: Record<TopicKey, string> = {
      fruits: 'Fruits',
      career: 'Career',
      random: 'Random'
    };

    topics.forEach((topic) => {
      const btn = document.createElement('button');
      btn.className = styles.topicBtn;
      btn.type = 'button';
      btn.textContent = topicLabels[topic];
      btn.addEventListener('click', () => this.onTopicSelect?.(topic));
      container.appendChild(btn);
    });
  }

  private setScreen(screen: 'home' | 'topic' | 'game'): void {
    this.homeSection.style.display = screen === 'home' ? 'flex' : 'none';
    this.topicSection.style.display = screen === 'topic' ? 'flex' : 'none';
    this.gameSection.style.display = screen === 'game' ? 'flex' : 'none';
  }
}

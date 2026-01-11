export type TopicKey = 'fruits' | 'career' | 'random';

export interface WordTopics {
  fruits: string[];
  career: string[];
  random: string[];
}

export interface GameState {
  topic: TopicKey | null;
  currentWord: string | null;
  wordIndex: number;
  wordsQueue: string[];
}

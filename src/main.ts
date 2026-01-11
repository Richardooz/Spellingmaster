import { AudioManager } from './managers/AudioManager';
import { GameManager } from './managers/GameManager';
import { UIManager } from './managers/UIManager';
import { words } from './data/words';
import './styles/app.module.css';

const root = document.querySelector('#app');

if (!root) {
	throw new Error('Missing #app root element.');
}

const uiManager = new UIManager(root as HTMLElement);
const audioManager = new AudioManager({
	basePath: '../assets/sounds',
	successFile: 'success.mp3',
	failFile: 'fail.mp3',
	defaultVolume: 0.9
});

const gameManager = new GameManager(words, uiManager, audioManager);

gameManager.start();

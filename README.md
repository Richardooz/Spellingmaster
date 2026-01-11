# Spelling Master (Vite + TypeScript)

A lightweight "Spelling Bee" style web game using Vite, TypeScript, HTML5, and CSS Modules.

## Quick Start

1) Initialize (or use this repo)
```bash
npm create vite@latest spelling-master -- --template vanilla-ts
```
2) Install deps
```bash
npm install
```
3) Run dev server
```bash
npm run dev
```
4) Build for production
```bash
npm run build
```

> The provided source already matches the Vite + TypeScript structure. If you use this repo as-is, just run steps 2-3.

## Assets
Place your files under `src/assets/`:
- Backgrounds: `src/assets/images/forest-bg.jpg` (or your own)
- Word sounds: `src/assets/sounds/{word}.mp3`
- Effects: `src/assets/sounds/success.mp3`, `src/assets/sounds/fail.mp3`

## Code Map
- Entry: `src/main.ts`
- Game flow: `src/managers/GameManager.ts`
- Audio playback: `src/managers/AudioManager.ts`
- UI DOM control: `src/managers/UIManager.ts`
- Topic data: `src/data/words.ts`
- Types: `src/types/game.ts`
- Styles: `src/styles/app.module.css`

## How It Works
- Pick a topic (Fruits, Career, or Random).
- Game loads the word queue, plays the word audio immediately, and shows the game panel.
- Type using your keyboard or the on-screen keys, then submit.
- Success plays the success effect and advances to the next word; failures play the fail effect.

## Customizing
- Add more topics in `src/data/words.ts` and extend `TopicKey` in `src/types/game.ts`.
- Adjust styling in `src/styles/app.module.css` (CSS Modules are used via class names in `UIManager`).
- Swap audio filenames in `src/main.ts` when constructing `AudioManager` if your naming differs.

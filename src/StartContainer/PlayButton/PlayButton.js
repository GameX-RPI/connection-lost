import * as PIXI from 'pixi.js';

export function initPlayButton() {
   const playButton = new PIXI.Graphics();
   const playButtonX = 165;
   const playButtonY = 55;
   playButton.roundRect(playButtonX / -2, playButtonY / -2 + 50, playButtonX, playButtonY, 20);
   playButton.alpha = 0.65;
   playButton.fill();
   return playButton;
}
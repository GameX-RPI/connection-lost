import * as PIXI from 'pixi.js';

export function initPlayText(textStyle) {
   const playText = new PIXI.Text({text: 'Play', style: textStyle});
   playText.x = 0;
   playText.y = 50;
   playText.anchor.set(0.5);
   return playText;
}
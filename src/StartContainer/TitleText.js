import * as PIXI from 'pixi.js';

export function initTitleText(app, textStyle) {
   const text1 = new PIXI.Text({text: 'Connection: ', style: textStyle});
   const text2 = new PIXI.Text({text: 'Lost', style: textStyle});

   text1.alpha = 0.65;
   text1.x = -text1.width/4;
   text1.y = -50;
   text1.anchor.set(0.5);
   text2.alpha = 0.65;
   text2.x = -text1.width/3 + text1.width - 125;
   text2.y = -50;
   text2.anchor.set(0.5);

   let blinkSpeed = 0.0135;
   app.ticker.add(() => {
      text2.alpha -= blinkSpeed;

      if (text2.alpha >= 0.8 || text2.alpha <= 0.5) {
         blinkSpeed *= -1;
      }
   });

   return [text1, text2];
}
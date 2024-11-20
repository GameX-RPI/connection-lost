import * as PIXI from 'pixi.js';

export function initTitleText(app, textStyle) {
   const text1 = new PIXI.Text({text: 'Connection: ', style: textStyle});
   const text2 = new PIXI.Text({text: 'Lost', style: textStyle});

   text1.alpha = 0.65;
   text2.alpha = 0.65;

   const totalWidth = text1.width + text2.width;

   text1.x = (app.screen.width - totalWidth) / 2;
   text1.y = app.screen.height / 2 - 30;
   text1.anchor.set(0, 0.5);

   text2.x = text1.x + text1.width;
   text2.y = text1.y;
   text2.anchor.set(0, 0.5);

   let blinkSpeed = 0.0135;
   app.ticker.add(() => {
      text2.alpha -= blinkSpeed;

      if (text2.alpha >= 0.8 || text2.alpha <= 0.3) {
         blinkSpeed *= -1;
      }
   });

   app.stage.addChild(text1, text2);
}
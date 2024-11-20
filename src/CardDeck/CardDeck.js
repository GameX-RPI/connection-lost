import * as PIXI from 'pixi.js';

const Deck = {
   //creates invisible box where cards will go
   initCardDeck() {
      const CardDeck = new PIXI.Container();
      CardDeck.visible = false;
      return CardDeck;
   },
   //creates a card
  
   async initCard(app, cardInfo, CardDeck) {
      const card = new PIXI.Container();

      card.depth = cardInfo.depth;
      card.character = cardInfo.character;
      card.response1 = cardInfo.response1;
      card.response2 = cardInfo.response2;
      card.result1 = cardInfo.result1;
      card.result2 = cardInfo.result2;

      const cardWidth = 200;
      const cardHeight = 200;
      card.width = cardWidth;
      card.height = cardHeight;

      const startCardX = (app.screen.width - cardWidth) / 2;
      const startCardY = (app.screen.height - cardHeight) / 2;

      const border = new PIXI.Graphics()
         .roundRect(startCardX, startCardY, cardWidth, cardHeight, 20)
         .fill('0xE3E3E3');
      card.addChild(border);

      await PIXI.Assets.load(cardInfo.image_file_path);
      const character = PIXI.Sprite.from(cardInfo.image_file_path);
      character.x = app.screen.width / 2 - character.width / 2;
      character.y = app.screen.height / 2 - character.height / 2;
      character.width = cardWidth;
      character.height = cardHeight;
      console.log(character.zIndex);

      const cardMask = new PIXI.Graphics()
         // .setStrokeStyle(5, 'black', 1)
         // .roundRect(startCardX - 5, startCardY - 5, cardWidth + 10, cardHeight + 10, 20)
         // .fill('0xB0B0B0');
         .roundRect(startCardX, startCardY, cardWidth, cardHeight, 20)
         .fill('0xC4A484');

      // const border = new PIXI.Graphics();
      // border.roundRect(-5, -5, cardWidth + 10, cardHeight + 10, 20);
      // border.roundRect(0, 0, cardWidth, cardHeight, 20);
      // border.position.copyFrom(character.position); // Align with the mask

      character.zIndex = 2;
      card.addChild(character);
      card.addChild(cardMask);
      // card.addChild(border);

      // cardMask.position.copyFrom(character.position);
      character.mask = cardMask;

      const overlay = new PIXI.Graphics();
      overlay.roundRect(startCardX, startCardY, cardWidth, cardHeight, 20);
      overlay.fill('0x51372A');
      overlay.visible = false;
      app.stage.addChild(overlay);

      // const content = new PIXI.Text({ text: cardInfo.dialogue, style: { fontSize: 13, fill: 0x000000, wordWrap: true, wordWrapWidth: 200, align: "center" } });

      // content.x = app.screen.width / 2 - content.width / 2;
      // content.y = app.screen.height / 2 - content.height / 2 - 150;
      // card.addChild(content);

      const scenario = new PIXI.Graphics();
      const width = 500;  
      const height = 50;  
      const x = app.stage.width / 2 - width / 2;
      const y = 0;

      scenario.roundRect(x - 5, y, width + 10, height + 5, 20);
      scenario.rect(x - 5, y, width + 10, 20);
      scenario.fill("0xB0B0B0");

      scenario.roundRect(x, y, width, height, 20);
      scenario.rect(x, y, width, 20);
      scenario.fill("0xE3E3E3");

      card.addChild(scenario);

      const content = new PIXI.Text({ text: cardInfo.dialogue, style: { fontSize: 13, fill: 0x000000, wordWrap: true, wordWrapWidth: 500, align: "center" } });
      content.x = app.screen.width / 2 - content.width / 2;
      content.y = scenario.y + 5;
      card.addChild(content);
      
      // // //

      const characterNameBox = new PIXI.Graphics();
      const widthC = 100;  
      const heightC = 40;  
      const xC = app.stage.width / 2 - widthC / 2;
      const yC = app.stage.height - heightC;

      characterNameBox.roundRect(xC - 5, yC - 5, widthC + 10, heightC + 5, 20);
      characterNameBox.rect(xC - 5, yC + heightC - 15, widthC + 10, 20);
      characterNameBox.fill("0xB0B0B0");

      characterNameBox.roundRect(xC, yC, widthC, heightC, 20);
      characterNameBox.rect(xC, yC + heightC - 15, widthC, 20);
      characterNameBox.fill("0xE3E3E3");

      card.addChild(characterNameBox);

      const characterName = new PIXI.Text({ text: cardInfo.character, style: { fontSize: 13, fill: 0x000000, wordWrap: true, wordWrapWidth: 500, align: "center" } });
      characterName.x = app.screen.width / 2 - characterName.width / 2;
      // characterName.x = app.screen.width / 2 - characterName.width / 2;
      characterName.y = app.stage.height - heightC / 2 - 8;
      card.addChild(characterName);

      // app.ticker.add(() => {
      //    characterNameBox.y -= 0.01;
      //    if (characterNameBox.y == app.stage.height - heightC) {
      //       return;
      //    }
      // });
      

      /* *** */

      let startX = 0;
      let startY = 0;
      let isDragging = false;
      card.interactive = true;

      //changed arrow to finger
      card.on('pointerover', () => {
         app.canvas.style.cursor = 'pointer';
      });

      //finger -> pointer
      card.on('pointerout', () => {
         app.canvas.style.cursor = 'default';
      });

      card.on('pointerdown', (event) => {
         startX = event.global.x;
         startY = event.global.y;
         isDragging = true;

         overlay.visible = true;

         //ensures that overlay is not covering current card
         app.stage.addChild(overlay);
         app.stage.addChild(card);

         app.stage.setChildIndex(overlay, app.stage.children.length - 2);
         app.stage.setChildIndex(card, app.stage.children.length - 1);
      });
      card.on('pointermove', (event) => {
         if (!isDragging) return;
         const deltaX = event.global.x - startX;
         const deltaY = event.global.y - startY;
         card.x += deltaX;
         card.y += deltaY;

         startX = event.global.x;
         startY = event.global.y;
         const direction = card.x > 0 ? 1 : -1;

         if (Math.abs(card.x) > 50) {
            let childGraphic;
            let childGraphic1 = card.getChildByLabel("1");
            let childGraphic2 = card.getChildByLabel("-1");
            if (childGraphic1 === null) {
               childGraphic = childGraphic2;
            } else {
               childGraphic = childGraphic1;
            }
            const childText = card.getChildByLabel("text");

            if (childText === null || (childText !== null && childGraphic.label != direction.toString())) {
               card.removeChild(childGraphic);
               card.removeChild(childText);

               const overlayBG = new PIXI.Graphics();

               overlayBG.label = direction > 0 ? "1" : "-1";
               let x = app.screen.width / 2 - cardWidth / 2;
               let y = app.screen.height / 2 - cardHeight + 200;
               let width = 30;
               let height = cardHeight;
               let radius = 20
               if (direction > 0) {
                  overlayBG.moveTo(x + cardWidth - 40, y);
                  overlayBG.arcTo(x + cardWidth, y, x + cardWidth, y + 20, 20);
                  overlayBG.lineTo(x + cardWidth, y + height - 20);
                  overlayBG.arcTo(x + cardWidth, y + height, x + cardWidth - 20, y + height, 20);
                  overlayBG.lineTo(x + cardWidth - 40, y + height);
               } else {
                  overlayBG.moveTo(x + 40, y);
                  overlayBG.arcTo(x, y, x, y + 20, 20);
                  overlayBG.lineTo(x, y + height - 20);
                  overlayBG.arcTo(x, y + height, x + 20, y + height, 20);
                  overlayBG.lineTo(x + 40, y + height);
               }

               overlayBG.fill("black");
               overlayBG.alpha = 0;
               card.addChild(overlayBG);

               const ticker = new PIXI.Ticker();
               ticker.add(() => {
                  if (overlayBG.alpha < 0.1) {
                     overlayBG.alpha += 0.003;
                  } else {
                     ticker.stop();
                  }
               });
               ticker.start();

               const overlayText = new PIXI.Text({
                  text: direction < 0 ? card.response1 : card.response2,
                  style:
                  {
                     fontSize: 40,
                     fill: 0xffffff,
                     align: 'center',
                  }
               });

               overlayText.label = "text";

               if (direction > 0) {
                  overlayText.angle += 90;
                  overlayText.x = app.screen.width / 2 + cardWidth / 2;
                  overlayText.y = app.screen.height / 2 - overlayText.width / 2;
               } else {
                  overlayText.angle -= 90;
                  overlayText.x = app.screen.width / 2 - cardWidth;
                  overlayText.y = app.screen.height / 2 + 20;
               }
               
               card.addChild(overlayText);
            }
         }
      });

      CardDeck.addChild(card);

      // Pointer up event
      return new Promise((resolve) => {
         card.on('pointerup', (event) => {
            isDragging = false;
   
            // Determine swipe direction and animate
            if (Math.abs(card.x) > 150) {
               // Swipe left or right
               const direction = card.x > 0 ? 1 : -1;
               Deck.animateSwipeOff(app, card, direction, overlay);

               if (direction < 0) {
                  card.choice = 1;
               }
               else {
                  card.choice = 2;
               }
               // console.log(card);
               resolve(card);
            } else {
               // Return to center if swipe wasn't strong enough
               Deck.animateResetPosition(app, card);
               // resolve(card);
            }
         });
      });
   },
   animateSwipeOff(app, card, direction, overlay) {
      const targetX = direction > 0 ? app.screen.width + card.width : app.screen.width - card.width;
      const targetRotation = direction > 0 ? 0.3 : -0.3; // Tilt angle (in radians)
      const swipeSpeed = 10;


      // Animate card position
      overlay.visible = false;

      app.ticker.add(function swipeOff() {
         card.x += direction * swipeSpeed;
         card.y += 2;

         // card.rotation += direction * 0.005;

         // Remove card when it goes off-screen
         if ((direction > 0 && card.x > app.screen.width + card.width) ||
            (direction < 0 && card.x < -app.screen.width)) {
            app.ticker.remove(swipeOff);
            app.stage.removeChild(card);
            app.stage.removeChild(overlay);
            // Optionally, create a new card or trigger an event here
         }
      });
   },
   animateResetPosition(app, card) {
      let childGraphic;
      let childGraphic1 = card.getChildByLabel("1");
      let childGraphic2 = card.getChildByLabel("-1");
      if (childGraphic1 === null) {
         childGraphic = childGraphic2;
      } else {
         childGraphic = childGraphic1;
      }
      const childText = card.getChildByLabel("text");
      if (childGraphic !== "null") {
         card.removeChild(childGraphic);
         card.removeChild(childText);
      }
      const startX = card.x;
      const startY = card.y;
      const startRotation = card.rotation;
      const duration = 15;
      let frame = 0;

      app.ticker.add(function reset() {
         frame += 1;
         card.x = startX + (0 - startX) * (frame / duration);
         card.y = startY + (0 - startY) * (frame / duration);
         card.rotation = startRotation * (1 - frame / duration);

         if (frame >= duration) {
            app.ticker.remove(reset);
            card.x = 0;
            card.y = 0;
            card.rotation = 0;
         }
      });
   }
};



export default Deck;
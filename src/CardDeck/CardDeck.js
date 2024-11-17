import * as PIXI from 'pixi.js';

const Deck = {
   //creates invisible box where cards will go
   initCardDeck() {
      const CardDeck = new PIXI.Container();
      CardDeck.visible = false;
      return CardDeck;
   },
   //creates a card
  
   async initCard(app, cardInfo, characterLevels, CardDeck) {
      const card = new PIXI.Container();
      const cardWidth = 300;
      const cardHeight = 400;
      card.width = cardWidth;
      card.height = cardHeight;

      const startCardX = (app.screen.width - cardWidth) / 2;
      const startCardY = (app.screen.height - cardHeight) / 2;

      const cardBG = new PIXI.Graphics();
      cardBG.roundRect(startCardX, startCardY, cardWidth, cardHeight, 20);
      cardBG.fill('0xC4A484');
      card.addChild(cardBG);


      const overlay = new PIXI.Graphics();
      overlay.roundRect(startCardX, startCardY, cardWidth, cardHeight, 20);
      overlay.fill('0x51372A');
      overlay.visible = false;
      app.stage.addChild(overlay);

      const content = new PIXI.Text({ text: cardInfo.dialogue, style: { fontSize: 12, fill: 0x000000, wordWrap: true, wordWrapWidth: 200, align: "center" } });

      content.x = app.screen.width / 2 - content.width / 2;
      content.y = app.screen.height / 2 - content.height / 2 - 150;
      card.addChild(content);

      await PIXI.Assets.load(cardInfo.image_file_path);
      const character = PIXI.Sprite.from(cardInfo.image_file_path);
      character.x = app.screen.width / 2 - character.width / 2;
      character.y = app.screen.height / 2 - character.height / 2;
      card.addChild(character);

      /* *** */

      let startX = 0;
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
         card.x += deltaX;

         startX = event.global.x;
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
                  text: direction < 0 ? "Yes" : "No",
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
                  overlayText.x = app.screen.width / 2 - cardWidth / 2;
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
               Deck.animateSwipeOff(app, card, direction, overlay, characterLevels);
               resolve(card);
            } else {
               // Return to center if swipe wasn't strong enough
               Deck.animateResetPosition(app, card);
               // resolve(card);
            }
         });
      });

      return card;
   },
   animateSwipeOff(app, card, direction, overlay, characterLevels) {
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

         //update characterLevels
         let choice;
         if (direction < 0) {
            choice = card.response1;
            console.log(characterLevels);
            characterLevels[card.character]++;
         }
         else {
            choice = card.response2;
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
      const startRotation = card.rotation;
      const duration = 15;
      let frame = 0;

      app.ticker.add(function reset() {
         frame += 1;
         card.x = startX + (0 - startX) * (frame / duration);
         card.rotation = startRotation * (1 - frame / duration);

         if (frame >= duration) {
            app.ticker.remove(reset);
            card.x = 0;
            card.rotation = 0;
         }
      });
   }
};



export default Deck;
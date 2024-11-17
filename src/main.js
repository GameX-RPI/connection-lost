import * as PIXI from 'pixi.js';
import { initDevtools } from '@pixi/devtools';

import { initStartContainer } from './StartContainer/StartContainer.js';
import { initTitleText } from './StartContainer/TitleText.js';

import { initPlayButtonContainer } from './StartContainer/PlayButton/PlayButtonContainer.js';
import { initPlayButton } from './StartContainer/PlayButton/PlayButton.js';
import { initPlayText } from './StartContainer/PlayButton/PlayText.js';

import Deck from './CardDeck/CardDeck.js';
import { initBg } from './Location/location.js';

import cards from './CardDeck/cards.json' assert { type: 'json' };
import locations from '../background.json' assert { type: 'json' };

(async () => {
  const app = new PIXI.Application();

  await app.init({
    resizeTo: window,
    backgroundAlpha: 1,
  });

  app.canvas.style.position = 'absolute';
  document.body.appendChild(app.canvas);

  initDevtools({ app });


  /* ---------- Text Styes ---------- */

  const titleStyle = new PIXI.TextStyle({
    fill: 0xffffff,
    fontSize: 72,
    fontFamily: 'Poppins',
  });

  const playStyle = new PIXI.TextStyle({
    fill: 0x000000,
    fontSize: 30,
    fontFamily: 'Poppins',
  });

  /* ---------- Start Container ---------- */

  const StartContainer = initStartContainer(app);
  app.stage.addChild(StartContainer);

  /* ---------- Title Text ---------- */

  const texts = initTitleText(app, titleStyle);
  StartContainer.addChild(texts[0]);
  StartContainer.addChild(texts[1]);

  /* ---------- Play Button ---------- */

  const playButtonContainer = initPlayButtonContainer();
  StartContainer.addChild(playButtonContainer);

  const playButton = initPlayButton();
  const playText = initPlayText(playStyle);

  playButtonContainer.addChild(playButton);
  playButtonContainer.addChild(playText);

  /* --------Play Origin Story-------- */

  // await initBg(app, 0);

  // const CardDeck = Deck.initCardDeck();
  // app.stage.addChild(CardDeck);
  
  // let deckSize = 60;
  // startCardDeck(deckSize, app, CardDeck);
  
  /* ---------- Start Game Mouse Events ---------- */
  
  playButtonContainer.interactive = true;
  
  playButtonContainer.on('pointerover', () => {
    app.canvas.style.cursor = 'pointer';
  });
  
  playButtonContainer.on('pointerout', () => {
    app.canvas.style.cursor = 'default';
  });
  
  playButtonContainer.on('pointerdown', async () => {
    app.stage.removeChild(StartContainer);
    
    await initBg(app, 0);
    
    const CardDeck = Deck.initCardDeck();
    app.stage.addChild(CardDeck);
    const characterLevels = new Map()
      .set('char1', 0)
      .set('char2', 0)
      .set('char3', 0)

    await playBackstory(app, CardDeck, characterLevels);
    gameLoop(app, CardDeck, characterLevels, 1);
  });
})();

async function playBackstory(app, CardDeck, characterLevels) {
  CardDeck.visible = true;
  // let deck_name = "";
  
  const backstoryImage = cards.locations.backstory.bgImage;
  const backstoryCards = cards.locations.backstory.cards;
  
  for (let i = 0; i < backstoryCards.length; i++) {
    const backstoryCard = backstoryCards[i];
    const card = await Deck.initCard(app, backstoryCard, characterLevels, CardDeck);
    // CardDeck.addChild(card);
  }
}

async function gameLoop(app, CardDeck, characterLevels, locationID) {
  let gameOver = 0;
  while (gameOver != 2) {
    const location = locations.Backgrounds[locationID].BgName;
    let availableCards = [];
    for (const [key, value] of characterLevels) {
      console.log(cards);
      const availableCharacterCards = cards.locations[location].cards.filter(card => card.character === key && card.depth === value);
      availableCards.push(...availableCharacterCards);
    }
    console.log(availableCards);
    const cardToPlay = availableCards[Math.floor(Math.random() * availableCards.length)];
    const card = await Deck.initCard(app, cardToPlay, characterLevels, CardDeck);
    // CardDeck.addChild(card);
    gameOver++;
  }
}

// async function startCardDeck(app, CardDeck) {
//   CardDeck.visible = true;
//   let deck_name = "";

//   const backstoryImage = cards.locations.backstory.bgImage;
//   const backstoryCards = cards.locations.backstory.cards;

//   for (let i = 0; i < backstoryCards.length; i++) {
//     const backstoryCard = backstoryCards[backstoryCards.length - 1 - i];
//     const card = await Deck.initCard(app, backstoryCard.dialogue);
//     CardDeck.addChild(card);
//   }
// }

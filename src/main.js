import * as PIXI from 'pixi.js';
import { initDevtools } from '@pixi/devtools';

import { initStartContainer } from './StartContainer/StartContainer.js';
import { initTitleText } from './StartContainer/TitleText.js';

import { initPlayButtonContainer } from './StartContainer/PlayButton/PlayButtonContainer.js';
import { initPlayButton } from './StartContainer/PlayButton/PlayButton.js';
import { initPlayText } from './StartContainer/PlayButton/PlayText.js';

import { initInfo } from './CardDeck/cardInfo.js'

import Deck from './CardDeck/CardDeck.js';
import { initBg } from './Location/location.js';

import cards from './CardDeck/cards.json' assert { type: 'json' };
import locations from '../background.json' assert { type: 'json' };

const loadFont = async (name, url) => {
  const font = new FontFace(name, `url(${url})`);
  await font.load();
  document.fonts.add(font);
};

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

  Promise.all([
    loadFont('Poppins', '../fonts/Poppins-Regular.ttf'),
    loadFont('Poppins-Bold', '../fonts/Poppins-Bold.ttf')
  ]).then(() => {
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

    initTitleText(app, titleStyle);

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
    
    let bg = await initBg(app, 0, null);
    
    const CardDeck = Deck.initCardDeck();
    app.stage.addChild(CardDeck);


    const characterDepth = new Map()
    // Town
      .set("Shopkeeper Dwight", 0)
      .set("Mayor Soren", 0)
      .set("Cleric Raymond", 0)
      .set("Bard Jamie", 0)
      .set("Prisoner Mo", 0)
      .set("Psychic", 0)
      .set("Assassin", 0)
      .set("Blacksmith Nakar", 0)
      .set("Innkeeper Thalia", 0)
      .set("Clockmaker Darwin", 0)

      // Thalia, Lana, Blake, Darwin, Roach
      // Falconer

    // Ocean
      .set("Mermaid ", 0)
      .set("Reef Shark ", 0)
      .set("Horseshoe Crab", 0)
      .set("Octopus", 0)
      .set("Scuba Diver", 0)
      .set("Slug", 0)  //Robert's Idea

    // Forest

    const trustLevels = new Map();

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
      
      const characterDepth = new Map()
      // Town
        .set("Shopkeeper Dwight", 0)
        .set("Mayor Soren", 0)
        .set("Cleric Raymond", 0)
        .set("Bard Jamie", 0)
        .set("Prisoner Mo", 0)
        .set("Psychic", 0)
        .set("Assassin", 0)
        .set("Blacksmith Nakar", 0)
        .set("Innkeeper Thalia", 0)
        .set("Clockmaker Darwin", 0)

      // Ocean
        .set("Mermaid ", 0)
        .set("Reef Shark ", 0)
        .set("Horseshoe Crab", 0)
        .set("Octopus", 0)
        .set("Scuba Diver", 0)
        .set("Slug", 0)  //Robert's Idea

      // Forest

      const trustLevels = new Map();
      
      // const lostFriend = "";

      await playBackstory(app);
      gameLoop(app, characterDepth, trustLevels, 1);
    });
  })
})();

async function playBackstory(app) {
  await initBg(app, 0);
  const CardDeck = Deck.initCardDeck();
  app.stage.addChild(CardDeck);
  initInfo(app);        // this creates the areas for text to appear, but initCard will populate the text
  
  const backstoryImage = cards.locations.backstory.bgImage;
  const backstoryCards = cards.locations.backstory.cards;
  
  for (let i = 0; i < backstoryCards.length; i++) {
    const backstoryCard = backstoryCards[i];
    const card = await Deck.initCard(app, backstoryCard, CardDeck);
  }

  app.stage.removeChild(CardDeck)
}

async function gameLoop(app, characterDepth, trustLevels, locationID) {
  let gameOver = 0;
  await initBg(app, locationID);
  const CardDeck = Deck.initCardDeck();
  app.stage.addChild(CardDeck);
  initInfo(app);

  // list of card IDs next to play
  let cardChain = [];

  while (gameOver != 10) {

    let cardToPlay;
    const location = locations.Backgrounds[locationID].BgName;
    if (cardChain.length > 0) { // card to play is pre-determined by previous card
      const chainID = cardChain.shift(); // removes first element returns it
      cardToPlay = cards.locations[location].cards.filter(card => card.chain === chainID);
      console.log(cardToPlay);
    } else { // pick random card
      let availableCards = [];
      for (const [key, value] of characterDepth) {
        const availableCharacterCards = cards.locations[location].cards.filter(card => card.character === key && card.depth === value);
        availableCards.push(...availableCharacterCards);
      }
      cardToPlay = availableCards[Math.floor(Math.random() * availableCards.length)];

  }
    // console.log(cardToPlay);
    if (!cardToPlay) {
      console.log("No cards remaining.");
      return;
    }
    const card = await Deck.initCard(app, cardToPlay, CardDeck);

    characterDepth.set(card.character, characterDepth.get(card.character) + 1); // +1 character interaction

    const res = card.choice == 1 ? card.result1 : card.result2;
    trustLevels.set(card.character, (trustLevels.get(card.character) || 0) + res); // +/- character trust

    cardToPlay.chain != -1 ? cardChain.push(cardToPlay.chain) : cardChain.length = 0; // append chain card ID or ensure empty chain list

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

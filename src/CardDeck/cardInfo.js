import * as PIXI from 'pixi.js';

export function initInfo(app) {
   const scenario = new PIXI.Graphics();
   scenario.label = "scenario";
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

   app.stage.addChild(scenario);

   const content = new PIXI.Text({ text: "", style: { fontSize: 13, fill: 0x000000, wordWrap: true, wordWrapWidth: 500, align: "center" } });
   
   content.label = "content";
   app.stage.addChild(content);



   const characterNameBox = new PIXI.Graphics();
   characterNameBox.label = "characterBox"
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

   app.stage.addChild(characterNameBox);

   const characterName = new PIXI.Text({ text: "", style: { fontSize: 13, fill: 0x000000, wordWrap: true, wordWrapWidth: 500, align: "center" } });
   characterName.x = app.screen.width / 2 - characterName.width / 2;
   characterName.y = app.stage.height - heightC / 2 - 8;
   characterName.label = "name"
   app.stage.addChild(characterName);

}
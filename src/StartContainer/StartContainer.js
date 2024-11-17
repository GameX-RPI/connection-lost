import * as PIXI from 'pixi.js';

export function initStartContainer(app) {
   const startContainer = new PIXI.Container();
   startContainer.position.set(app.screen.width / 2, app.screen.height / 2);
   return startContainer;
}
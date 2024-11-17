import * as PIXI from 'pixi.js';

export async function initBg(app, id) {
    let response = await fetch("../../background.json");
    let data = await response.json();

    let background = data.Backgrounds[id].ImageSrc;
    await PIXI.Assets.load(background);
    const bg = PIXI.Sprite.from(background);
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    app.stage.addChild(bg);
}
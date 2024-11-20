import * as PIXI from 'pixi.js';

export async function initBg(app, id) {
    let response = await fetch("../../background.json");
    let data = await response.json();

    let background = data.Backgrounds[id].ImageSrc;
    await PIXI.Assets.load(background);
    const bg = PIXI.Sprite.from(background);
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    bg.alpha = 0;
    app.stage.addChild(bg);
    const fadeIn = () => {
        bg.alpha += 0.01;
        if (bg.alpha >= 1) {
            bg.alpha = 1; // Ensure alpha is precisely 1
            app.ticker.remove(fadeIn); // Remove this specific ticker
        }
    };

    app.ticker.add(fadeIn); // Start the fade-in
}
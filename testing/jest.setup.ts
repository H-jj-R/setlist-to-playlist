const next = require("next");
const { setup: setupPuppeteer } = require("jest-environment-puppeteer");

const app = next({ dev: false });
let server;

export default async () => {
    await setupPuppeteer();
    await app.prepare();
    server = app.getServer();

    await new Promise<void>((resolve, reject) => {
        server.listen(3000, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    global.__NEXT_SERVER__ = server;
};

export const teardown = async () => {
    server.close();
    global.__NEXT_SERVER__ = null;
};

const { setup: setupPuppeteer } = require("jest-environment-puppeteer");
const next = require("next");

const app = next({ dev: false });
let server;

export default async (): Promise<void> => {
    await setupPuppeteer();
    await app.prepare();
    server = app.getServer();

    await new Promise<void>((resolve, reject): void => {
        server.listen(3000, (err: any): void => {
            if (err) return reject(err);
            resolve();
        });
    });

    global.__NEXT_SERVER__ = server;
};

export const teardown = async (): Promise<void> => {
    server.close();
    global.__NEXT_SERVER__ = null;
};

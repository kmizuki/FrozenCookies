import { copyFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const steamDirectory = path.join(scriptDirectory, "..", "Steam", "FrozenCookies");
const loaderVariants = {
    local: path.join(steamDirectory, "main.local.js"),
    prod: path.join(steamDirectory, "main.prod.js"),
};
const activeLoader = path.join(steamDirectory, "main.js");

const selectedMode = process.argv[2] ?? "status";

async function printLoaderStatus() {
    const activeContent = await readFile(activeLoader, "utf8");
    const variantContents = await Promise.all(
        Object.entries(loaderVariants).map(async ([mode, variantPath]) => [mode, await readFile(variantPath, "utf8")]),
    );

    const matchedMode = variantContents.find(([, content]) => content === activeContent)?.[0];

    if (matchedMode) {
        console.log(`Steam loader mode: ${matchedMode}`);
        return;
    }

    console.log("Steam loader mode: custom");
}

if (selectedMode === "status") {
    await printLoaderStatus();
    process.exit(0);
}

if (!Object.hasOwn(loaderVariants, selectedMode)) {
    console.error("Usage: bun run scripts/use-steam-loader.mjs [local|prod|status]");
    process.exit(1);
}

await copyFile(loaderVariants[selectedMode], activeLoader);
console.log(`Updated Steam/FrozenCookies/main.js to ${selectedMode} mode.`);

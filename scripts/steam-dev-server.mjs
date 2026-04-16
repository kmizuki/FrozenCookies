import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(scriptDirectory, "..");
const host = process.env.HOST ?? "127.0.0.1";
const configuredPort = process.env.PORT ?? process.argv[2] ?? "8000";
const port = Number.parseInt(configuredPort, 10);

if (Number.isNaN(port) || port <= 0) {
    console.error(`Invalid port: ${configuredPort}`);
    process.exit(1);
}

function toSafePathname(requestPathname) {
    const normalizedPath = path.normalize(path.join(projectRoot, requestPathname));

    if (!normalizedPath.startsWith(projectRoot)) {
        return null;
    }

    return normalizedPath;
}

const server = Bun.serve({
    hostname: host,
    port,
    async fetch(request) {
        const requestUrl = new URL(request.url);
        const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
        const absolutePath = toSafePathname(pathname);

        if (!absolutePath) {
            return new Response("Forbidden", { status: 403 });
        }

        const file = Bun.file(absolutePath);

        if (!(await file.exists())) {
            return new Response("Not Found", { status: 404 });
        }

        return new Response(file);
    },
});

console.log(`Serving FrozenCookies at http://${host}:${server.port}`);
console.log(`Test page: http://${host}:${server.port}/`);
console.log(`Steam loader target: http://${host}:${server.port}/frozen_cookies.js`);
console.log("Keep this process running while you test the Steam mod from another terminal or browser.");

import { serve } from "https://deno.land/std@0.127.0/http/server.ts";

const port = 80;

const getPathOfRequest = (req: Request): string =>
    req.url.split(/^https?:[/]+[^/]+/)[1].split(/[?#]/)[0];

const handler = (req: Request): Response => {
    const path = getPathOfRequest(req);
    if (path === "/") {
        return new Response("Hello World!");
    } else {
        return new Response(null, { status: 404 });
    }
};

serve(handler, { port });
console.log(`Listening on port http://localhost:${port}`);

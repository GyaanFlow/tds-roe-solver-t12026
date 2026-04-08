import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

export function resolveRequestPath(urlPathname) {
  const safePath = urlPathname === '/'
    ? 'index.html'
    : urlPathname.replace(/^\/+/, '');
  const absolutePath = path.resolve(ROOT_DIR, safePath);
  const relative = path.relative(ROOT_DIR, absolutePath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }

  return absolutePath;
}

export function createAppServer() {
  return http.createServer((req, res) => {
    if (!req.url) {
      send(res, 400, 'Bad request', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }

    if (!['GET', 'HEAD'].includes(req.method || 'GET')) {
      send(res, 405, 'Method not allowed', {
        'Content-Type': 'text/plain; charset=utf-8',
        'Allow': 'GET, HEAD'
      });
      return;
    }

    let pathname = '/';
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      send(res, 400, 'Bad request', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }

    const filePath = resolveRequestPath(pathname);
    if (!filePath) {
      send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      if (statError || !stats.isFile()) {
        send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const headers = {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      };

      if (req.method === 'HEAD') {
        res.writeHead(200, headers);
        res.end();
        return;
      }

      const stream = fs.createReadStream(filePath);
      stream.on('open', () => res.writeHead(200, headers));
      stream.on('error', () => {
        if (!res.headersSent) {
          send(res, 500, 'Internal server error', { 'Content-Type': 'text/plain; charset=utf-8' });
        } else {
          res.destroy();
        }
      });
      stream.pipe(res);
    });
  });
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  createAppServer().listen(PORT, () => {
    console.log(`TDS workspace server -> http://localhost:${PORT}`);
  });
}

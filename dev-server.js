// Servidor local de desenvolvimento, sem dependências. Uso: node dev-server.js [porta]
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT) || 5500;
const HOST = '127.0.0.1';

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
}

http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Método não permitido');

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        return send(res, 400, 'Requisição inválida');
    }
    if (pathname.includes('\0')) return send(res, 400, 'Requisição inválida');

    let filePath = path.join(ROOT, pathname);
    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return send(res, 403, 'Acesso negado');

    fs.stat(filePath, (err, stat) => {
        if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
        fs.readFile(filePath, (readErr, data) => {
            if (readErr) return send(res, 404, 'Não encontrado');
            const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
            send(res, 200, req.method === 'HEAD' ? '' : data, type);
        });
    });
}).listen(PORT, HOST, () => {
    console.log(`noteous em http://localhost:${PORT}`);
});

const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath);
  const contentType = (MIME[ext] || 'text/plain') + '; charset=utf-8';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - Página não encontrada');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ╔════════════════════════════════════════╗');
  console.log('  ║   AEGIS CRM · Landing Page             ║');
  console.log('  ╠════════════════════════════════════════╣');
  console.log(`  ║   ✅  http://localhost:${PORT}             ║`);
  console.log('  ║   Pressione Ctrl+C para encerrar       ║');
  console.log('  ╚════════════════════════════════════════╝');
  console.log('');
});

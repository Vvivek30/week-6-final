const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const port = process.env.PORT || 3000;

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return mime[ext] || 'application/octet-stream';
}

function readFileSafe(filePath) {
  return fs.readFileSync(filePath);
}

function getGitHubCopilotToken() {
  const envToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.COPILOT_TOKEN;
  if (!envToken) {
    return '';
  }
  return envToken.trim();
}

function callGitHubCopilot(payload) {
  const token = getGitHubCopilotToken();
  if (!token) {
    return Promise.reject(new Error('No GitHub token is configured on the server. Set GITHUB_TOKEN before running this app.'));
  }

  return fetch('https://api.githubcopilot.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || 'GitHub Copilot request failed.');
    }
    return data;
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const response = await callGitHubCopilot({
          model: payload.model || 'gpt-4o',
          messages: payload.messages || [{ role: 'user', content: payload.prompt || 'Hello' }],
          temperature: payload.temperature ?? 0.8,
          max_tokens: payload.max_tokens ?? 800
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message || 'Server error' }));
      }
    });
    return;
  }

  let requestedPath = req.url === '/' ? '/index.html' : req.url;
  requestedPath = decodeURIComponent(requestedPath.split('?')[0]);

  const fullPath = path.join(root, requestedPath);
  if (!fullPath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const file = readFileSafe(fullPath);
    res.writeHead(200, { 'Content-Type': getMime(fullPath) });
    res.end(file);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`PromptForge Studio server running on http://localhost:${port}`);
});

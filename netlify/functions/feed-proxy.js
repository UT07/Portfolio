const https = require('https');
const http = require('http');

const fetchText = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
};

const ALLOWED_HOSTS = [
  'feeds.soundcloud.com',
  'www.youtube.com',
  'youtube.com',
];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const { url } = event.queryStringParameters || {};

  if (!url) {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'url parameter required' }),
    };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      statusCode: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid URL' }),
    };
  }

  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return {
      statusCode: 403,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Host not allowed' }),
    };
  }

  try {
    const content = await fetchText(url);
    const contentType = url.includes('youtube.com') || url.includes('soundcloud.com')
      ? 'application/xml'
      : 'text/plain';

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': contentType },
      body: content,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch feed', details: err.message }),
    };
  }
};

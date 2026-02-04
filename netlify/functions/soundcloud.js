const https = require('https');

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const userId = process.env.SOUNDCLOUD_USER_ID;

  if (!clientId || !userId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'SoundCloud credentials not configured' }),
    };
  }

  const { action } = event.queryStringParameters || {};

  try {
    if (action === 'user') {
      const userData = await fetchJson(
        `https://api-v2.soundcloud.com/users/${userId}?client_id=${clientId}`
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          followers_count: userData.followers_count,
          track_count: userData.track_count,
          public_favorites_count: userData.public_favorites_count,
        }),
      };
    }

    if (action === 'tracks') {
      const limit = event.queryStringParameters?.limit || 25;
      const data = await fetchJson(
        `https://api-v2.soundcloud.com/users/${userId}/tracks?client_id=${clientId}&limit=${limit}`
      );
      const tracks = (data.collection || []).map((track) => ({
        title: track.title,
        permalink_url: track.permalink_url,
        created_at: track.created_at,
        duration: track.duration,
        artwork_url: track.artwork_url,
        playback_count: track.playback_count,
        likes_count: track.likes_count,
        reposts_count: track.reposts_count,
      }));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ tracks }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action. Use ?action=user or ?action=tracks' }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch from SoundCloud', details: err.message }),
    };
  }
};

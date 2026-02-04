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

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE || 'utmixes';
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'YouTube API key not configured' }),
    };
  }

  const { action } = event.queryStringParameters || {};

  try {
    if (action === 'channel') {
      let url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&key=${apiKey}`;
      if (channelId) {
        url += `&id=${encodeURIComponent(channelId)}`;
      } else {
        url += `&forHandle=${encodeURIComponent(channelHandle)}`;
      }

      const data = await fetchJson(url);
      const channel = data.items?.[0];

      if (!channel) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Channel not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads,
          statistics: {
            subscriberCount: channel.statistics?.subscriberCount,
            viewCount: channel.statistics?.viewCount,
            videoCount: channel.statistics?.videoCount,
            hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount,
          },
        }),
      };
    }

    if (action === 'playlist') {
      const playlistId = event.queryStringParameters?.playlistId;
      if (!playlistId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'playlistId parameter required' }),
        };
      }

      const maxResults = event.queryStringParameters?.maxResults || 12;
      const data = await fetchJson(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=${maxResults}&playlistId=${playlistId}&key=${apiKey}`
      );

      const items = (data.items || []).map((item) => ({
        videoId: item.contentDetails?.videoId,
        title: item.snippet?.title,
        publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ items }),
      };
    }

    if (action === 'videos') {
      const videoIds = event.queryStringParameters?.ids;
      if (!videoIds) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ids parameter required (comma-separated video IDs)' }),
        };
      }

      const data = await fetchJson(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
      );

      const stats = (data.items || []).reduce((acc, entry) => {
        acc[entry.id] = {
          viewCount: entry.statistics?.viewCount,
          likeCount: entry.statistics?.likeCount,
          commentCount: entry.statistics?.commentCount,
        };
        return acc;
      }, {});

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ stats }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action. Use ?action=channel, ?action=playlist, or ?action=videos' }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch from YouTube', details: err.message }),
    };
  }
};

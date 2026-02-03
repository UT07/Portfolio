import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { SiSoundcloud, SiYoutube } from 'react-icons/si';
import djData from '../data/djData.json';
import placeholderImage from '../assets/asset-placeholder.svg';
import { assetUrl } from '../utils/assets';

const Sets = () => {
  const { sets, hero } = djData;
  const [remotePlatforms, setRemotePlatforms] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const fallbackThumbnail = useMemo(
    () => assetUrl(hero?.hero_image || '/images/PICTURES/REDLINE%20HORIZON/Cris35mm_3335.jpg'),
    [hero?.hero_image]
  );
  const feedProxy = process.env.REACT_APP_FEED_PROXY || 'https://api.allorigins.win/raw?url=';
  const fallbackYouTubeChannelId = 'UCWnMlnsp7eqI8iOCRmule8A';
  const compactFormatter = useMemo(
    () => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }),
    []
  );

  const getPlatformIcon = (platformName) => {
    if (platformName === 'SoundCloud') return SiSoundcloud;
    if (platformName === 'YouTube') return SiYoutube;
    return null;
  };

  const parseYear = useCallback((value) => {
    if (!value) return 'Live';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Live';
    return date.getFullYear().toString();
  }, []);

  const parseDuration = useCallback((durationText) => {
    if (!durationText) return 'Mix';
    const cleaned = durationText.trim();
    if (!cleaned) return 'Mix';
    const parts = cleaned.split(':').map((part) => Number(part));
    if (parts.some((part) => Number.isNaN(part))) return durationText;
    let seconds = 0;
    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    if (parts.length === 1) seconds = parts[0];
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} min`;
  }, []);

  const formatStatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') return compactFormatter.format(value);
    if (typeof value === 'string' && /^\d+$/.test(value)) return compactFormatter.format(Number(value));
    return value;
  };

  const buildFallbackStats = (platform) => {
    const setsList = platform?.sets || [];
    const years = setsList
      .map((setItem) => Number.parseInt(setItem?.date, 10))
      .filter((year) => !Number.isNaN(year));
    const latestYear = years.length > 0 ? Math.max(...years).toString() : 'Live';
    const countLabel = platform?.name === 'SoundCloud' ? 'Tracks' : 'Videos';
    const stats = [
      { label: countLabel, value: setsList.length.toString() },
      { label: 'Latest', value: latestYear }
    ];

    if (platform?.name === 'SoundCloud') {
      const totalMinutes = setsList.reduce((sum, setItem) => {
        const match = typeof setItem?.duration === 'string' ? setItem.duration.match(/(\d+)\s*min/i) : null;
        return sum + (match ? Number(match[1]) : 0);
      }, 0);
      if (totalMinutes > 0) {
        stats.push({ label: 'Runtime', value: `${totalMinutes} min` });
      }
    }

    return stats;
  };

  const resolveSoundCloudUserId = useCallback(async (profileUrl) => {
    if (!profileUrl) return null;
    const response = await fetch(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(profileUrl)}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    const html = data?.html || '';
    const match = html.match(/users%2F(\\d+)/);
    return match ? match[1] : null;
  }, []);

  const parseSoundCloudRss = useCallback((xmlText) => {
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    const items = Array.from(doc.getElementsByTagName('item'));
    const channelImage = doc
      .getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'image')?.[0]
      ?.getAttribute('href');

    return items.slice(0, 12).map((item) => {
      const title = item.getElementsByTagName('title')?.[0]?.textContent?.trim() || 'SoundCloud set';
      const link = item.getElementsByTagName('link')?.[0]?.textContent?.trim() || 'https://soundcloud.com';
      const pubDate = item.getElementsByTagName('pubDate')?.[0]?.textContent;
      const durationText = item
        .getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'duration')?.[0]
        ?.textContent;
      const imageNode = item
        .getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'image')?.[0];
      const thumbnail = imageNode?.getAttribute('href') || channelImage || fallbackThumbnail;

      return {
        title,
        url: link,
        date: parseYear(pubDate),
        duration: parseDuration(durationText),
        thumbnail
      };
    });
  }, [fallbackThumbnail, parseDuration, parseYear]);

  const parseYouTubeRss = useCallback((xmlText) => {
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    const entries = Array.from(doc.getElementsByTagName('entry'));

    return entries.slice(0, 12).map((entry) => {
      const title = entry.getElementsByTagName('title')?.[0]?.textContent?.trim() || 'YouTube set';
      const link = entry.getElementsByTagName('link')?.[0]?.getAttribute('href') || 'https://www.youtube.com';
      const published = entry.getElementsByTagName('published')?.[0]?.textContent;
      const thumbnail = entry
        .getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')?.[0]
        ?.getAttribute('url');

      return {
        title,
        url: link,
        date: parseYear(published),
        duration: 'Live',
        thumbnail: thumbnail || fallbackThumbnail
      };
    });
  }, [fallbackThumbnail, parseYear]);

  useEffect(() => {
    const scClientId = process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID;
    const scUserId = process.env.REACT_APP_SOUNDCLOUD_USER_ID;
    const scProfileUrl = process.env.REACT_APP_SOUNDCLOUD_PROFILE_URL;
    const scAllowApi = process.env.REACT_APP_SOUNDCLOUD_ALLOW_API === 'true';
    const ytApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const ytPlaylistId = process.env.REACT_APP_YOUTUBE_PLAYLIST_ID;
    const ytChannelId = process.env.REACT_APP_YOUTUBE_CHANNEL_ID || fallbackYouTubeChannelId;
    const ytHandle = process.env.REACT_APP_YOUTUBE_CHANNEL_HANDLE;

    const fetchSoundCloud = async () => {
      let userId = scUserId;
      if (!userId && scProfileUrl) {
        userId = await resolveSoundCloudUserId(scProfileUrl);
      }

      if (scAllowApi && scClientId && userId) {
        try {
          let stats = null;
          try {
            const userResponse = await fetch(
              `https://api-v2.soundcloud.com/users/${userId}?client_id=${scClientId}`
            );
            if (userResponse.ok) {
              const userData = await userResponse.json();
              stats = [
                { label: 'Followers', value: userData?.followers_count },
                { label: 'Tracks', value: userData?.track_count },
                { label: 'Likes', value: userData?.public_favorites_count }
              ].filter((stat) => stat.value !== undefined && stat.value !== null);
            }
          } catch (error) {
            // If stats fail, continue with tracks.
          }

          const response = await fetch(
            `https://api-v2.soundcloud.com/users/${userId}/tracks?client_id=${scClientId}&limit=25`
          );
          if (!response.ok) throw new Error('SoundCloud fetch failed');
          const data = await response.json();
          const tracks = data.collection || [];
          return {
            name: 'SoundCloud',
            url: sets.platforms.find((p) => p.name === 'SoundCloud')?.url || 'https://soundcloud.com',
            logo: '/images/logo-soundcloud.svg',
            sets: tracks.map((track) => ({
              title: track.title,
              url: track.permalink_url,
              date: parseYear(track.created_at),
              duration: `${Math.max(1, Math.round(track.duration / 60000))} min`,
              thumbnail: track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : fallbackThumbnail,
              stats: [
                { label: 'Plays', value: track.playback_count },
                { label: 'Likes', value: track.likes_count },
                { label: 'Reposts', value: track.reposts_count }
              ].filter((stat) => stat.value !== undefined && stat.value !== null)
            })),
            stats
          };
        } catch (error) {
          // Fallback to RSS below.
        }
      }

      if (!userId) return null;
      const rssUrl = `https://feeds.soundcloud.com/users/soundcloud:users:${userId}/sounds.rss`;
      const response = await fetch(`${feedProxy}${encodeURIComponent(rssUrl)}`);
      if (!response.ok) throw new Error('SoundCloud RSS fetch failed');
      const xmlText = await response.text();
      const rssSets = parseSoundCloudRss(xmlText);
      if (!rssSets.length) return null;
      return {
        name: 'SoundCloud',
        url: sets.platforms.find((p) => p.name === 'SoundCloud')?.url || 'https://soundcloud.com',
        logo: '/images/logo-soundcloud.svg',
        sets: rssSets,
        stats: buildFallbackStats({ name: 'SoundCloud', sets: rssSets })
      };
    };

    const fetchYouTube = async () => {
      let playlistId = ytPlaylistId;
      let channelStats = null;

      if (ytApiKey) {
        try {
          if (!playlistId) {
            const handle = ytHandle || 'utmixes';
            const channelRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&forHandle=${encodeURIComponent(handle)}&key=${ytApiKey}`
            );
            if (channelRes.ok) {
              const channelData = await channelRes.json();
              playlistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
              channelStats = channelData?.items?.[0]?.statistics || null;
            }
          }
          if (!playlistId && ytChannelId) {
            const channelRes = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&id=${encodeURIComponent(ytChannelId)}&key=${ytApiKey}`
            );
            if (channelRes.ok) {
              const channelData = await channelRes.json();
              playlistId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
              channelStats = channelData?.items?.[0]?.statistics || null;
            }
          }
          if (playlistId) {
            const response = await fetch(
              `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=12&playlistId=${playlistId}&key=${ytApiKey}`
            );
            if (!response.ok) throw new Error('YouTube fetch failed');
            const data = await response.json();
            const items = data.items || [];
            const videoIds = items
              .map((item) => item.contentDetails?.videoId)
              .filter(Boolean);
            let videoStats = {};
            if (videoIds.length > 0) {
              const statsRes = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${ytApiKey}`
              );
              if (statsRes.ok) {
                const statsData = await statsRes.json();
                videoStats = (statsData.items || []).reduce((acc, entry) => {
                  acc[entry.id] = entry.statistics || {};
                  return acc;
                }, {});
              }
            }
            return {
              name: 'YouTube',
              url: `https://www.youtube.com/playlist?list=${playlistId}`,
              logo: '/images/logo-youtube.svg',
              sets: items.map((item) => ({
                title: item.snippet?.title || 'YouTube set',
                url: `https://www.youtube.com/watch?v=${item.contentDetails?.videoId}`,
                date: parseYear(item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt),
                duration: 'Live',
                thumbnail: item.snippet?.thumbnails?.medium?.url || fallbackThumbnail,
                stats: (() => {
                  const stats = videoStats[item.contentDetails?.videoId] || {};
                  const list = [
                    { label: 'Views', value: stats.viewCount },
                    { label: 'Likes', value: stats.likeCount },
                    { label: 'Comments', value: stats.commentCount }
                  ].filter((stat) => stat.value !== undefined && stat.value !== null);
                  return list.length > 0 ? list : null;
                })()
              })),
              stats: channelStats
                ? [
                    channelStats.hiddenSubscriberCount
                      ? null
                      : { label: 'Subscribers', value: channelStats.subscriberCount },
                    { label: 'Views', value: channelStats.viewCount },
                    { label: 'Videos', value: channelStats.videoCount }
                  ].filter(Boolean)
                : null
            };
          }
        } catch (error) {
          // Fallback to RSS below.
        }
      }

      if (!ytChannelId) return null;
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${ytChannelId}`;
      const response = await fetch(`${feedProxy}${encodeURIComponent(rssUrl)}`);
      if (!response.ok) throw new Error('YouTube RSS fetch failed');
      const xmlText = await response.text();
      const rssSets = parseYouTubeRss(xmlText);
      if (!rssSets.length) return null;
      return {
        name: 'YouTube',
        url: `https://www.youtube.com/channel/${ytChannelId}`,
        logo: '/images/logo-youtube.svg',
        sets: rssSets,
        stats: buildFallbackStats({ name: 'YouTube', sets: rssSets })
      };
    };

    const fetchRemote = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const results = await Promise.allSettled([fetchSoundCloud(), fetchYouTube()]);
        const platforms = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value)
          .filter(Boolean);
        const errors = results
          .filter((result) => result.status === 'rejected')
          .map((result) => result.reason);

        if (platforms.length > 0) {
          setRemotePlatforms(platforms);
        } else if (errors.length > 0) {
          setLoadError(errors[0]);
        }
      } catch (error) {
        setLoadError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRemote();
  }, [
    sets.platforms,
    fallbackThumbnail,
    feedProxy,
    fallbackYouTubeChannelId,
    parseSoundCloudRss,
    parseYouTubeRss,
    parseYear,
    resolveSoundCloudUserId
  ]);

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const platformsToRender = useMemo(() => {
    if (!remotePlatforms) return sets.platforms;
    return sets.platforms.map((platform) => (
      remotePlatforms.find((remote) => remote.name === platform.name) || platform
    ));
  }, [remotePlatforms, sets.platforms]);

  return (
    <section id="sets" className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,26,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Animated title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-300"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white font-unbounded">
              {sets.title.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-base font-medium tracking-wide text-neutral-400 font-space-mono"
          >
            {sets.description}
          </motion.p>
        </motion.div>

        <div className="space-y-16">
          {isLoading && (
            <p className="text-sm text-neutral-400 font-space-mono">Loading live sets…</p>
          )}
          {loadError && (
            <p className="text-sm text-neutral-500 font-space-mono">
              Live feed unavailable — showing curated sets.
            </p>
          )}
          {platformsToRender.map((platform, platformIndex) => {
            const accentColor = platform.name === 'SoundCloud' ? 'red' : 'red';
            const stats = platform.stats && platform.stats.length > 0 ? platform.stats : buildFallbackStats(platform);
            
            return (
              <motion.div
                key={platformIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: platformIndex * 0.2, duration: 0.6 }}
                className="relative"
              >
                {/* Platform header with logo */}
                <div className="flex items-center gap-6 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="relative"
                  >
                    {(() => {
                      const Icon = getPlatformIcon(platform.name);
                      return (
                        <div
                          className="w-20 h-20 rounded-2xl border border-red-500/40 bg-neutral-950/60 flex items-center justify-center text-red-400"
                          style={{
                            boxShadow: `0 0 30px rgba(${accentColor === 'red' ? '255,26,64' : '255,94,112'},0.4)`
                          }}
                        >
                          {Icon ? <Icon className="w-10 h-10" /> : <Play className="w-8 h-8" />}
                        </div>
                      );
                    })()}
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wider font-unbounded mb-2">
                      {platform.name}
                    </h3>
                    <motion.button
                      onClick={() => openExternal(platform.url)}
                      className={`flex items-center gap-2 px-4 py-2 border ${
                        accentColor === 'red'
                          ? 'border-red-500 text-red-500 hover:bg-red-500'
                          : 'border-red-500 text-red-500 hover:bg-red-500'
                      } hover:text-black transition-all text-xs font-space-mono uppercase tracking-wider`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Profile
                      <ExternalLink className="w-3 h-3" />
                    </motion.button>
                    {stats.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {stats.map((stat) => (
                          <div
                            key={`${platform.name}-${stat.label}`}
                            className={`px-3 py-2 border text-xs uppercase tracking-widest font-space-mono ${
                              accentColor === 'red'
                                ? 'border-red-500/40 text-red-200 bg-red-500/10'
                                : 'border-red-500/40 text-red-200 bg-red-500/10'
                            }`}
                            style={{
                              boxShadow:
                                accentColor === 'red'
                                  ? '0 0 12px rgba(255,26,64,0.25)'
                                  : '0 0 12px rgba(255,94,112,0.25)'
                            }}
                          >
                            <div className="text-[10px] text-neutral-400">{stat.label}</div>
                            <div className="text-sm font-bold">{formatStatValue(stat.value)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sets grid with thumbnails */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {platform.sets.map((set, setIndex) => (
                    <motion.div
                      key={setIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: setIndex * 0.1, duration: 0.4 }}
                      whileHover={{ 
                        y: -8,
                        boxShadow: `0 0 40px rgba(${accentColor === 'red' ? '255,26,64' : '255,94,112'},0.4)`
                      }}
                      onClick={() => openExternal(set.url)}
                      className="group relative bg-black/50 backdrop-blur-sm border border-white/10 overflow-hidden cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={assetUrl(set.thumbnail)}
                          alt={set.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          onError={(event) => {
                            if (event.currentTarget.dataset.fallback === 'true') return;
                            event.currentTarget.dataset.fallback = 'true';
                            event.currentTarget.src = placeholderImage;
                          }}
                        />
                        
                        {/* Play button overlay */}
                        <motion.div
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className={`w-20 h-20 rounded-full ${
                              accentColor === 'red' ? 'bg-red-500' : 'bg-red-500'
                            } flex items-center justify-center`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Play className="w-10 h-10 text-black ml-1" fill="black" />
                          </motion.div>
                        </motion.div>

                        {/* Duration badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 ${
                          accentColor === 'red' ? 'bg-red-500/90' : 'bg-red-500/90'
                        } text-black text-xs font-bold font-space-mono`}>
                          {set.duration}
                        </div>
                      </div>

                      {/* Set info */}
                      <div className="p-6">
                        <h4 className="text-white font-semibold font-space-mono text-lg mb-2 group-hover:text-red-400 transition-colors">
                          {set.title}
                        </h4>
                        <p className={`text-xs ${
                          accentColor === 'red' ? 'text-red-400' : 'text-red-400'
                        } font-space-mono`}>
                          {set.date}
                        </p>
                        {set.stats && set.stats.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {set.stats.map((stat) => (
                              <span
                                key={`${set.title}-${stat.label}`}
                                className={`px-2 py-1 text-[10px] uppercase tracking-widest font-space-mono border ${
                                  accentColor === 'red'
                                    ? 'border-red-500/40 text-red-200 bg-red-500/10'
                                    : 'border-red-500/40 text-red-200 bg-red-500/10'
                                }`}
                              >
                                {formatStatValue(stat.value)} {stat.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Animated border */}
                      <motion.div
                        className={`absolute inset-0 border-2 ${
                          accentColor === 'red' ? 'border-red-500' : 'border-red-500'
                        } opacity-0 group-hover:opacity-100 pointer-events-none`}
                        initial={false}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Sets;

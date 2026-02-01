import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import djData from '../data/djData.json';

const Sets = () => {
  const { sets, hero } = djData;
  const [remotePlatforms, setRemotePlatforms] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const fallbackThumbnail = useMemo(() => hero?.hero_image || '/images/PICTURES/REDLINE%20HORIZON/Cris35mm_3335.jpg', [hero?.hero_image]);

  useEffect(() => {
    const scClientId = process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID;
    const scUserId = process.env.REACT_APP_SOUNDCLOUD_USER_ID;
    const ytApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const ytPlaylistId = process.env.REACT_APP_YOUTUBE_PLAYLIST_ID;

    if (!scClientId && !ytApiKey) return;

    const fetchSoundCloud = async () => {
      if (!scClientId || !scUserId) return null;
      const response = await fetch(
        `https://api-v2.soundcloud.com/users/${scUserId}/tracks?client_id=${scClientId}&limit=25`
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
          date: new Date(track.created_at).getFullYear().toString(),
          duration: `${Math.max(1, Math.round(track.duration / 60000))} min`,
          thumbnail: track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : fallbackThumbnail
        }))
      };
    };

    const fetchYouTube = async () => {
      if (!ytApiKey || !ytPlaylistId) return null;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=12&playlistId=${ytPlaylistId}&key=${ytApiKey}`
      );
      if (!response.ok) throw new Error('YouTube fetch failed');
      const data = await response.json();
      const items = data.items || [];
      return {
        name: 'YouTube',
        url: `https://www.youtube.com/playlist?list=${ytPlaylistId}`,
        logo: '/images/logo-youtube.svg',
        sets: items.map((item) => ({
          title: item.snippet?.title || 'YouTube set',
          url: `https://www.youtube.com/watch?v=${item.contentDetails?.videoId}`,
          date: new Date(item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt).getFullYear().toString(),
          duration: 'Live',
          thumbnail: item.snippet?.thumbnails?.medium?.url || fallbackThumbnail
        }))
      };
    };

    const fetchRemote = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [soundcloud, youtube] = await Promise.all([fetchSoundCloud(), fetchYouTube()]);
        const platforms = [soundcloud, youtube].filter(Boolean);
        if (platforms.length > 0) setRemotePlatforms(platforms);
      } catch (error) {
        setLoadError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRemote();
  }, [sets.platforms, fallbackThumbnail]);

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
          backgroundImage: 'linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
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
              className="w-16 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500"
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
            const accentColor = platform.name === 'SoundCloud' ? 'fuchsia' : 'cyan';
            
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
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative"
                  >
                    <img 
                      src={platform.logo}
                      alt={`${platform.name} logo`}
                      className="w-24 h-24 rounded-2xl border-2 border-white/20 object-cover"
                      loading="lazy"
                      decoding="async"
                      style={{
                        boxShadow: `0 0 30px rgba(${accentColor === 'fuchsia' ? '217,70,239' : '6,182,212'},0.4)`
                      }}
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-wider font-unbounded mb-2">
                      {platform.name}
                    </h3>
                    <motion.button
                      onClick={() => openExternal(platform.url)}
                      className={`flex items-center gap-2 px-4 py-2 border ${
                        accentColor === 'fuchsia'
                          ? 'border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500'
                          : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500'
                      } hover:text-black transition-all text-xs font-space-mono uppercase tracking-wider`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Profile
                      <ExternalLink className="w-3 h-3" />
                    </motion.button>
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
                        boxShadow: `0 0 40px rgba(${accentColor === 'fuchsia' ? '217,70,239' : '6,182,212'},0.4)`
                      }}
                      onClick={() => openExternal(set.url)}
                      className="group relative bg-black/50 backdrop-blur-sm border border-white/10 overflow-hidden cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={set.thumbnail}
                          alt={set.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                        
                        {/* Play button overlay */}
                        <motion.div
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className={`w-20 h-20 rounded-full ${
                              accentColor === 'fuchsia' ? 'bg-fuchsia-500' : 'bg-cyan-500'
                            } flex items-center justify-center`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Play className="w-10 h-10 text-black ml-1" fill="black" />
                          </motion.div>
                        </motion.div>

                        {/* Duration badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 ${
                          accentColor === 'fuchsia' ? 'bg-fuchsia-500/90' : 'bg-cyan-500/90'
                        } text-black text-xs font-bold font-space-mono`}>
                          {set.duration}
                        </div>
                      </div>

                      {/* Set info */}
                      <div className="p-6">
                        <h4 className="text-white font-semibold font-space-mono text-lg mb-2 group-hover:text-fuchsia-400 transition-colors">
                          {set.title}
                        </h4>
                        <p className={`text-xs ${
                          accentColor === 'fuchsia' ? 'text-fuchsia-400' : 'text-cyan-400'
                        } font-space-mono`}>
                          {set.date}
                        </p>
                      </div>

                      {/* Animated border */}
                      <motion.div
                        className={`absolute inset-0 border-2 ${
                          accentColor === 'fuchsia' ? 'border-fuchsia-500' : 'border-cyan-500'
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

export const YouTubePlaylistCarousel = ({ list, description = "", videos = null }) => {
  const playlistId = useMemo(() => {
    if (!list) return "";
    const match = list.match(/[?&]list=([^&]+)/);
    return match ? match[1] : list;
  }, [list]);
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
  const cacheKey = `yt-playlist-${playlistId}`;
  const cacheTtlMs = 60 * 60 * 1000;

  // Explicit video IDs pin the slide list; otherwise the playlist player
  // reports them at runtime (cached below).
  const pinnedVideos = useMemo(() => {
    if (Array.isArray(videos)) return videos;
    if (typeof videos === "string" && videos.trim()) return videos.trim().split(/[\s,]+/);
    return null;
  }, [videos]);

  const playerRef = useRef(null);
  const playingRefs = useRef({});
  const trackRef = useRef(null);
  const [videoIds, setVideoIds] = useState(pinnedVideos || []);
  const [playing, setPlaying] = useState(new Set());
  const [channel, setChannel] = useState(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const readCache = () => {
    try {
      return JSON.parse(localStorage.getItem(cacheKey));
    } catch {
      return null;
    }
  };

  const writeCache = (patch) => {
    try {
      const previous = readCache() || {};
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ ...previous, ...patch, fetchedAt: Date.now() })
      );
    } catch {
      // Storage unavailable (private browsing, quota) — live data still renders.
    }
  };

  // Stale-while-revalidate: render whatever was cached immediately; only hit
  // oEmbed again when the cache is missing or older than an hour. A failed
  // fetch silently leaves the cached render in place.
  useEffect(() => {
    if (!playlistId) return;
    const cached = readCache();
    if (cached?.channel) setChannel(cached.channel);
    if (!pinnedVideos && Array.isArray(cached?.videos) && cached.videos.length > 0) {
      setVideoIds(cached.videos);
    }
    if (cached?.fetchedAt && Date.now() - cached.fetchedAt < cacheTtlMs) return;
    fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(playlistUrl)}&format=json`
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.author_name) return;
        const url = (data.author_url || "").startsWith("http")
          ? data.author_url
          : `https://www.youtube.com${data.author_url || ""}`;
        const freshChannel = { name: data.author_name, url };
        setChannel(freshChannel);
        writeCache({ channel: freshChannel });
      })
      .catch(() => {});
  }, [playlistId]);

  // The playlist player broadcasts its video IDs over the enablejsapi
  // postMessage channel once we send the "listening" handshake.
  useEffect(() => {
    if (!playlistId) return;
    const onMessage = (event) => {
      if (event.origin !== "https://www.youtube.com") return;
      if (!playerRef.current || event.source !== playerRef.current.contentWindow) return;
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      const ids = data?.info?.playlist;
      if (Array.isArray(ids) && ids.length > 0 && ids.every((id) => typeof id === "string")) {
        if (!pinnedVideos) setVideoIds(ids);
        writeCache({ videos: ids });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [playlistId, pinnedVideos]);

  const pauseAll = (exceptVideoId) => {
    const pause = (iframe) =>
      iframe?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "https://www.youtube.com"
      );
    Object.entries(playingRefs.current).forEach(([videoId, iframe]) => {
      if (videoId !== exceptVideoId) pause(iframe);
    });
    pause(playerRef.current);
  };

  // If the page is backgrounded — e.g. the viewer clicked "Watch on YouTube",
  // which opens a new tab — pause everything so audio doesn't play doubled.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) pauseAll();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const handlePlayerLoad = () => {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: "ytplaylist", channel: "widget" }),
      "https://www.youtube.com"
    );
  };

  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [videoIds]);

  const scrollByPage = (direction) => {
    pauseAll();
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  const handleTrackScroll = () => {
    updateArrows();
    pauseAll();
  };

  return (
    <div className="yt-carousel">
      {description && <p className="yt-carousel-description">{description}</p>}
      <div className="yt-carousel-viewport">
        <div className="yt-carousel-track" ref={trackRef} onScroll={handleTrackScroll}>
          {videoIds.length === 0 && (
            <div className="yt-carousel-slide">
              <iframe
                ref={playerRef}
                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&enablejsapi=1`}
                title="YouTube playlist player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onLoad={handlePlayerLoad}
              ></iframe>
            </div>
          )}
          {videoIds.map((videoId) =>
            playing.has(videoId) ? (
              <div className="yt-carousel-slide" key={videoId}>
                <iframe
                  ref={(element) => {
                    if (element) playingRefs.current[videoId] = element;
                    else delete playingRefs.current[videoId];
                  }}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="yt-carousel-slide" key={videoId}>
                <button
                  type="button"
                  className="yt-carousel-thumb"
                  aria-label="Play video"
                  onClick={() => {
                    pauseAll(videoId);
                    setPlaying((previous) => new Set(previous).add(videoId));
                  }}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                  <span className="yt-carousel-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                </button>
              </div>
            )
          )}
        </div>
        {!(atStart && atEnd) && (
          <>
            <button
              type="button"
              className="yt-carousel-arrow yt-carousel-arrow-left"
              aria-label="Previous videos"
              disabled={atStart}
              onClick={() => scrollByPage(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="yt-carousel-arrow yt-carousel-arrow-right"
              aria-label="Next videos"
              disabled={atEnd}
              onClick={() => scrollByPage(1)}
            >
              ›
            </button>
          </>
        )}
      </div>
      {channel && (
        <div className="yt-carousel-footer">
          <a
            className="yt-carousel-subscribe"
            href={`${channel.url}?sub_confirmation=1`}
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12c0 1.9.2 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.3-1.9.5-3.9.5-5.8s-.2-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
            </svg>
            Subscribe to {channel.name}
          </a>
        </div>
      )}
    </div>
  );
};

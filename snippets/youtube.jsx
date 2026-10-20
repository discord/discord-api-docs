export const YouTubeEmbed = ({
  src,
  title = "YouTube video player",
  showDuration = false,
  chapters = "",
}) => {
  const iframeRef = useRef(null);
  const detailsRef = useRef(null);
  const [duration, setDuration] = useState(null);
  const [activeChapter, setActiveChapter] = useState(-1);

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  };

  // Chapters are pasted verbatim from the video description, one chapter per
  // line. Tolerates the formats descriptions use in the wild: "0:00 Title",
  // "* 00:00 - Title", "- 1:02:03: Title". Lines without a timestamp are ignored.
  const parsedChapters = useMemo(() => {
    if (!chapters) return [];
    return chapters
      .split("\n")
      .map((line) => {
        const match = line.match(
          /^\s*[-*•]?\s*(?:(\d+):)?(\d{1,2}):(\d{2})\s*[-–—:]?\s*(\S.*)$/
        );
        if (!match) return null;
        const [, h, m, s, chapterTitle] = match;
        const seconds =
          (h ? parseInt(h, 10) * 3600 : 0) + parseInt(m, 10) * 60 + parseInt(s, 10);
        return {
          seconds,
          // Normalized rather than echoed back, so "00:00:00" renders as "0:00".
          label: formatDuration(seconds),
          title: chapterTitle.trim(),
        };
      })
      .filter(Boolean);
  }, [chapters]);

  const jsApiEnabled = showDuration || parsedChapters.length > 0;

  // The chapter list overlays the page like a menu, so close it on any
  // click/tap outside of it.
  useEffect(() => {
    if (parsedChapters.length === 0) return;
    const onPointerDown = (event) => {
      const details = detailsRef.current;
      if (details?.open && !details.contains(event.target)) details.open = false;
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [parsedChapters.length]);

  useEffect(() => {
    if (!jsApiEnabled) return;
    const onMessage = (event) => {
      if (event.origin !== "https://www.youtube.com") return;
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      const seconds = data?.info?.duration;
      if (typeof seconds === "number" && seconds > 0) setDuration(seconds);
      const currentTime = data?.info?.currentTime;
      if (typeof currentTime === "number" && parsedChapters.length > 0) {
        let index = -1;
        for (let i = 0; i < parsedChapters.length; i++) {
          if (parsedChapters[i].seconds <= currentTime) index = i;
        }
        setActiveChapter(index);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [jsApiEnabled, parsedChapters]);

  const postToPlayer = (payload) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify(payload),
      "https://www.youtube.com"
    );
  };

  const handleLoad = () => {
    postToPlayer({ event: "listening", id: "ytembed", channel: "widget" });
  };

  const seekTo = (seconds) => {
    postToPlayer({ event: "command", func: "seekTo", args: [seconds, true] });
    postToPlayer({ event: "command", func: "playVideo", args: [] });
  };

  const embedSrc = jsApiEnabled ? `${src}${src.includes("?") ? "&" : "?"}enablejsapi=1` : src;

  return (
    <div>
      <iframe
        ref={iframeRef}
        className="w-full aspect-video rounded-xl"
        src={embedSrc}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={jsApiEnabled ? handleLoad : undefined}
      ></iframe>
      {(showDuration || parsedChapters.length > 0) && (
        <div className="relative mt-2 flex items-start justify-between gap-4 text-sm text-gray-500 dark:text-zinc-500">
          {parsedChapters.length > 0 && (
            <details ref={detailsRef}>
              <summary className="cursor-pointer select-none">Chapters</summary>
              <ul className="absolute left-0 top-full z-10 mt-1 mb-0 max-h-72 w-max max-w-full list-none overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 pl-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                {parsedChapters.map((chapter, index) => (
                  <li key={chapter.seconds} className="m-0 pl-0">
                    <button
                      type="button"
                      className={`cursor-pointer rounded-md px-1.5 py-0.5 text-left hover:text-gray-700 dark:hover:text-zinc-300 ${
                        index === activeChapter
                          ? "bg-gray-100 text-gray-800 dark:bg-zinc-700 dark:text-zinc-200"
                          : ""
                      }`}
                      onClick={() => {
                        seekTo(chapter.seconds);
                        if (detailsRef.current) detailsRef.current.open = false;
                      }}
                    >
                      <span className="font-medium text-primary dark:text-primary-light">
                        {chapter.label}
                      </span>{" "}
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {showDuration && duration !== null && (
            <p className="m-0 ml-auto">Duration: {formatDuration(duration)}</p>
          )}
        </div>
      )}
    </div>
  );
};

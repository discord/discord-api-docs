export const YouTubeEmbed = ({ src, title = "YouTube video player" }) => {
  return (
    <iframe
      className="w-full aspect-video rounded-xl"
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
};

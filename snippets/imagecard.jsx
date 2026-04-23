export const ImageCard = ({ img, href, title, children, imageHeight = 120, imageFade = false, imageOffset = 0 }) => {
  return (
    <div
      className="MDXImageCard image-card-wrapper"
      style={{ position: 'relative', cursor: 'pointer', marginTop: '0.5rem', marginBottom: '0.5rem' }}
    >
      <a
        href={href}
        aria-label={title}
        className="MDXImageCard image-card-link"
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      />
      <div
        className="MDXImageCard image-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '1rem',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <div style={{
          height: `${imageHeight}px`,
          width: '100%',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: '#242429',
          ...(imageFade && {
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          }),
        }}>
          <img
            src={img}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center calc(50% - ${imageOffset}px)`, display: 'block', margin: 0 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem 1.5rem', flex: 1 }}>
          <p className="MDXImageCard image-card-title" style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
            {title}
          </p>
          {children && (
            <p className="MDXImageCard image-card-description" style={{ margin: '0.25rem 0 0', fontSize: '1rem', lineHeight: '1.5rem' }}>
              {children}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

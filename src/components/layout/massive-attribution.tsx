const wrapperStyle = {
  fontSize: '0.75rem',
  color: '#fff',
  lineHeight: 1.4,
};

const linkStyle = {
  color: '#fecaca',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
};

export function MassiveAttribution() {
  return (
    <span style={wrapperStyle}>
      Market data provided by{' '}
      <a
        href="https://polygon.io"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        Massive
      </a>
    </span>
  );
}

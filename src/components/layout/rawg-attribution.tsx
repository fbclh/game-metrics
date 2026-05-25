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

export function RawgAttribution() {
  return (
    <span style={wrapperStyle}>
      Data provided by{' '}
      <a
        href="https://rawg.io"
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        RAWG
      </a>
    </span>
  );
}

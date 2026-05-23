const wrapperStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
  lineHeight: 1.4,
};

const linkStyle = {
  color: '#9ca3af',
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

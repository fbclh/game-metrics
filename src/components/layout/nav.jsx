const badgeStyle = {
  display: 'inline-grid',
  placeItems: 'center',
  backgroundColor: '#e60012',
  color: '#fff',
  fontFamily: 'var(--font-press-start-2p), cursive',
  fontSize: '1.5rem',
  border: '6px solid #fff',
  borderRadius: '999px',
  padding: '7px 12px',
  boxSizing: 'border-box',
};

const textStyle = {
  display: 'block',
  margin: 0,
  padding: 0,
  lineHeight: 1,
  textTransform: 'uppercase',
  textAlign: 'center',
  transform: 'translateY(2px)',
};

export function Nav() {
  return (
    <span style={badgeStyle}>
      <span style={textStyle}>Game</span>
    </span>
  );
}

const badgeStyle = {
  display: 'inline-grid',
  placeItems: 'center',
  backgroundColor: '#e60012',
  color: '#fff',
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '1.5rem',
  border: '6px solid #fff',
  borderRadius: '999px',
  padding: '7px 12px',
  boxSizing: 'border-box' as const,
};

const textStyle = {
  display: 'block',
  margin: 0,
  padding: 0,
  lineHeight: 1,
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
  transform: 'translateY(2px)',
};

export function Nav() {
  return (
    <span style={badgeStyle}>
      <span style={textStyle}>Game</span>
    </span>
  );
}

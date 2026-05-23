import { RawgAttribution } from './rawg-attribution';

const layoutStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const mainStyle = {
  flex: 1,
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1.5rem',
  marginTop: 'auto',
  backgroundColor: '#bf0010',
  borderTop: 'none',
};

const brandStyle = {
  fontSize: '0.75rem',
  color: '#fff',
};

export function AppLayout({ children }) {
  return (
    <div style={layoutStyle}>
      <main style={mainStyle}>{children}</main>
      <footer style={footerStyle}>
        <RawgAttribution />
        <span style={brandStyle}>GameMetrics</span>
      </footer>
    </div>
  );
}

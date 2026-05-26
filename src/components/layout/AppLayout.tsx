import { MassiveAttribution } from './massive-attribution';

const layoutStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
};

const mainStyle = {
  flex: 1,
  paddingBottom: '1rem',
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

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={layoutStyle}>
      <main style={mainStyle}>{children}</main>
      <footer style={footerStyle}>
        <MassiveAttribution />
        <span style={brandStyle}>MarketMetrics</span>
      </footer>
    </div>
  );
}

import { RawgAttribution } from '../components/layout/rawg-attribution';

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1.5rem',
  borderTop: '1px solid #e5e7eb',
};

const brandStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer style={footerStyle}>
          <RawgAttribution />
          <span style={brandStyle}>GameMetrics</span>
        </footer>
      </body>
    </html>
  );
}

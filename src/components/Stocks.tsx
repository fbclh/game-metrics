import Link from 'next/link';
import type { StockResult } from '../api/API';
import styles from '../styles/Stocks.module.css';

interface StocksProps {
  stocks: StockResult[];
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

function getInitials(ticker: string): string {
  return ticker.slice(0, 2).toUpperCase();
}

function formatExchange(exchange: string): string {
  if (exchange === 'XNAS') return 'NASDAQ';
  if (exchange === 'XNYS') return 'NYSE';
  return exchange;
}

export function Stocks({
  stocks,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
}: StocksProps) {
  if (stocks.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className="w-full max-w-[calc(190px*5+1.25rem*4)]">
        <ul className={styles.ul}>
          {stocks.map((stock) => (
            <li className={styles.li} key={stock.ticker}>
              <Link
                href={`/stocks/${encodeURIComponent(stock.ticker)}`}
                className={styles.cardLink}
              >
                <div className={styles.media}>
                  {stock.logo_url ? (
                    <img
                      className={styles.logo}
                      src={stock.logo_url}
                      alt={`${stock.name} logo`}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      {getInitials(stock.ticker)}
                    </div>
                  )}
                </div>
                <div className={styles.caption}>
                  <p className={styles.ticker}>{stock.ticker}</p>
                  <p className={styles.name}>{stock.name}</p>
                  <span className={styles.exchange}>
                    {formatExchange(stock.primary_exchange)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {hasMore && onLoadMore && (
          <div className={styles.loadMoreWrap}>
            <button
              type="button"
              className={styles.loadMore}
              onClick={onLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

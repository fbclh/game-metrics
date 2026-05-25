import Link from 'next/link';
import type { Game } from '../api/API';
import styles from '../styles/Games.module.css';

interface GamesProps {
  games: Game[];
}

export const Games = ({ games }: GamesProps) => {
  const sorted = [...games].sort((a, b) => b.id - a.id);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <ul className={styles.ul}>
        {sorted.map((game) => (
          <li className={styles.li} key={game.id}>
            <Link href={`/games/${game.id}`} className={styles.cardLink}>
              {game.background_image?.trim() ? (
                <img
                  className={styles.img}
                  src={game.background_image}
                  alt={game.name}
                />
              ) : (
                <div className={styles.placeholder}>{game.name}</div>
              )}
              <div className={styles.caption}>
                <p className={styles.name}>{game.name}</p>
                <div className={styles.meta}>
                  {game.metacritic != null && game.metacritic > 0 && (
                    <span className={styles.metacritic}>{game.metacritic}</span>
                  )}
                  {game.released && (
                    <span className={styles.year}>{game.released.slice(0, 4)}</span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

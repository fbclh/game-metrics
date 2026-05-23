import styles from '../styles/Games.module.css';

export const Games = ({ games }) => {
  const sorted = [...games].sort((a, b) => b.id - a.id);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <ul className={styles.ul}>
        {sorted.map((game) => (
          <li className={styles.li} key={game.id}>
            {game.background_image ? (
              <img
                className={styles.img}
                src={game.background_image}
                alt={game.name}
              />
            ) : (
              <div className={styles.placeholder}>{game.name}</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

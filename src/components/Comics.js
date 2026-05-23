import styles from '../styles/Comics.module.css';

export const Comics = ({ comics }) => {
  const sorted = [...comics].sort((a, b) => b.id - a.id);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <ul className={styles.ul}>
        {sorted.map((comic) => (
          <li className={styles.li} key={comic.id}>
            <img
              className={styles.img}
              src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
              alt={comic.title}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

import styles from '../styles/Comics.module.css';

export const Comics = ({ comics }) => {
  comics.sort((a, b) => b.id - a.id);

  return (
    <section className={styles.section}>
      <ul className={styles.ul}>
        {comics.map((comic) => (
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

import styles from '../styles/Pagination.module.css';

export const Pagination = () => (
  <section>
    <div className={styles.container}>
      <div>
        <button className={styles.button}>PREVIOUS PAGE</button>
      </div>
      <div>
        <button className={styles.button}>NEXT PAGE</button>
      </div>
    </div>
  </section>
);

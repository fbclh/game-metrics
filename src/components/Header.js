import { useEffect, useState } from 'react';
import { Nav } from './layout/nav';
import styles from '../styles/Header.module.css';

export const Header = ({ characters, handleOnChange, handleSubmit }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${hidden ? styles.headerHidden : ''}`}
    >
      <div className={styles.logo}>
        <Nav />
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search game"
          value={characters}
          onChange={handleOnChange}
        />
      </form>
    </header>
  );
};

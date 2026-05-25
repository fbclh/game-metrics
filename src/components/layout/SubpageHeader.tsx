'use client';

import { Nav } from './nav';
import { SearchForm } from './SearchForm';
import styles from '../../styles/Header.module.css';

export function SubpageHeader() {
  return (
    <header className={styles.subpageHeader}>
      <div className={styles.logo}>
        <Nav />
      </div>
      <SearchForm />
    </header>
  );
}

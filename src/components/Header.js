import logo from '../assets/logo.svg';
import styles from '../styles/Header.module.css';

export const Header = ({ characters, handleOnChange, handleSubmit }) => (
  <header className={styles.header}>
    <div>
      <img src={logo} alt="Marvel logo" height="60" />
    </div>
    <form onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search character"
        value={characters}
        onChange={handleOnChange}
      />
    </form>
  </header>
);

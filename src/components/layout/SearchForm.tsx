'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { getSessionId } from '@/lib/session';
import styles from '../../styles/Header.module.css';

type SearchFormProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (query: string) => void;
};

export function SearchForm({ value, onChange, onSubmit }: SearchFormProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined && onChange !== undefined;
  const inputValue = isControlled ? value : internalValue;

  const handleChange = (nextValue: string) => {
    if (isControlled) {
      onChange(nextValue);
    } else {
      setInternalValue(nextValue);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    if (onSubmit) {
      onSubmit(query);
      return;
    }

    fetch('/api/telemetry/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        session_id: getSessionId(),
      }),
    }).catch(() => {});

    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search stocks, ETFs..."
        value={inputValue}
        onChange={(event) => handleChange(event.target.value)}
      />
    </form>
  );
}

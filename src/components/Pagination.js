import styles from '../styles/Pagination.module.css';

const MAX_VISIBLE_PAGES = 10;

function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export const Pagination = ({
  page,
  pageCount,
  onPageSelect,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  disabled = false,
}) => {
  const pages = getVisiblePages(page, pageCount);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.button}
        onClick={onPrevious}
        disabled={disabled || !hasPrevious}
      >
        PREVIOUS PAGE
      </button>
      <div className={styles.pages} aria-label="Pagination">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={
              pageNumber === page ? styles.pageActive : styles.pageNumber
            }
            onClick={() => onPageSelect(pageNumber)}
            disabled={disabled}
            aria-current={pageNumber === page ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.button}
        onClick={onNext}
        disabled={disabled || !hasNext}
      >
        NEXT PAGE
      </button>
    </div>
  );
};

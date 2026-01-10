import React from 'react';
import styles from '../css/Spinner.module.css';

function Spinner() {
  return (
    <div className={styles.spinnerContainer}>
      <img src="/img/android-chrome-192x192.png" alt="Loading..." className={styles.spinnerIcon} />
    </div>
  );
}

export default Spinner;

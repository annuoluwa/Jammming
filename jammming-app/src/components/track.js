import React from 'react';
import styles from '../css/track.module.css';

function Tracks({ track, onAdd, onRemove }) {
  return (
    <div className={styles.trackRow}>
      <div className={styles.trackInfo}>
      <h3>{track.name}</h3>
      <p>{track.album}</p>
      <p>{track.artist}</p>
      </div>
      {onAdd && <button onClick={() => onAdd(track)} className={styles.trackButton}>+</button>}
      {onRemove && <button onClick={() => onRemove(track)}>-</button>}
      
    </div>
  );
}

export default Tracks;

import React from 'react';
import Tracks from './track';
import styles from '../css/tracklist.module.css';

function TrackList({ tracks, onAdd, onRemove }) {
  return (
    <div className={styles.tracklist}>
      {tracks.map((track) => (
        <Tracks 
          key={track.id}
          track={track}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default TrackList;

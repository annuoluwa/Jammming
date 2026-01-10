import React from 'react';
import TrackList from './tracklist';
import styles from '../css/searchresult.module.css';

function SearchResult({ tracks, onAdd }) {
  return (
    <section className={styles.container}>
      <h2 className={styles.styleh2}>Search Results</h2>

      {tracks && tracks.length > 0 ? (
        <TrackList tracks={tracks} onAdd={onAdd} />
      ) : (
        <div className={styles.emptyResult}>
          <p>No results found. Try searching for something else.</p>
        </div>
      )}
    </section>
  );
}

export default SearchResult;

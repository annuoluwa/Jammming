import React from 'react';
import Tracks from './track';
import styles from '../css/playlist.module.css';

function Playlist({ name, playlistSongs, onNameChange, onRemove, onSave }) {
  function handleChange(e) {
    onNameChange(e.target.value); // allows user to edit playlist name
  }

  return (
    <div className={styles.container}>
    <section className="playlist">
      <input 
        value={name} 
        onChange={handleChange} 
        placeholder="Enter playlist name"
        className={styles.playlistInput}
      />

      {playlistSongs.length > 0 ? (
        playlistSongs.map((track) => (
          <Tracks 
            key={track.id}
            track={track}
            onRemove={onRemove}
          />
        ))
      ) : (
        <p>Your playlist is empty. Add songs from the search results.</p>
      )}

      <button onClick={onSave} className={styles.playlistButton}>Save</button>
    </section>
    </div>
  );
}

export default Playlist;

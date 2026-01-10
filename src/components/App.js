import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import SearchResult from './searchresult';
import SearchBar from './searchbar';
import Playlist from './playlist';
import {
  redirectToAuthCodeFlow,
  searchTracks,
  handleAuthRedirect,
} from './spotify';
import Header from './header';
import Footer from './footer';
import { savePlaylistToSpotify } from './spotify';
import styles from '../css/App.module.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistSongs, setPlaylistSongs] = useState([]);

  useEffect(() => {
    async function checkAuth() {
      await handleAuthRedirect();
      const token = localStorage.getItem('access_token');
      setLoggedIn(!!token);
      setTimeout(() => setLoading(false), 1200); // 1.2s simulated delay
    }
    checkAuth();
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('playlistName');
    if (savedName) {
      setPlaylistName(savedName);
    }

    const savedSongs = localStorage.getItem('playlistSongs');
    if (savedSongs) {
      try {
        const parsedSongs = JSON.parse(savedSongs);
        if (Array.isArray(parsedSongs)) {
          setPlaylistSongs(parsedSongs);
        }
      } catch (error) {
        console.error("Failed to parse saved songs:", error);
      }
    }
  }, []);

  const handleLogin = () => {
    redirectToAuthCodeFlow();
  };

  const handleSearch = async (term) => {
    if (!term) return;
    setLoading(true);
    const results = await searchTracks(term);
    setSearchResults(results);
    setTimeout(() => setLoading(false), 1200); // 1.2s simulated delay
  };

  const addTrack = (track) => {
    if (playlistSongs.find((saved) => saved.id === track.id)) return;
    const updatePlaylist = [...playlistSongs, track];
    setPlaylistSongs(updatePlaylist);
    localStorage.setItem('playlistSongs', JSON.stringify(updatePlaylist));
  };

  const removeTrack = (track) => {
    const updatedTrack = playlistSongs.filter((saved) => saved.id !== track.id);
    setPlaylistSongs(updatedTrack);
    localStorage.setItem('playlistSongs', JSON.stringify(updatedTrack));
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
    localStorage.setItem('playlistName', name);
  };

  const savePlaylist = () => {
    // Implement playlist saving to Spotify
    savePlaylistToSpotify(playlistName, playlistSongs);
    setPlaylistName('');
    setPlaylistSongs([]);
    localStorage.removeItem('playlistName');
    localStorage.removeItem('playlistsongs');
    alert(`Saving playlist: ${playlistName} with ${playlistSongs.length} songs`);
  };

  if (loading) return <Spinner />;

  if (!loggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Welcome to Jammming </h1>

          <button className={styles.loginButton} onClick={handleLogin}>
            Login with Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.mainContent}>
        <SearchBar onSearch={handleSearch} />

        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.panel}`}>
            <SearchResult tracks={searchResults} onAdd={addTrack} />
          </div>

          <div className={`${styles.column} ${styles.panel}`}>
            <h2 className={styles.playlistTitle}>Playlist</h2>

            <Playlist
              name={playlistName}
              playlistSongs={playlistSongs}
              onNameChange={updatePlaylistName}
              onRemove={removeTrack}
              onSave={savePlaylist}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

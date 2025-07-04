import React, {useState, useEffect} from 'react';
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



const sampleTracks = [ //demo tracks
  {
name: 'Waymaker',
album: 'Great God',
artist: 'Sinach',
id: 1,
uri: "spotify:track:6rqhFgbbKwnb9MLmUQDhG6",


  },

  {
   
name: 'Excess Love',
album: 'Satisfied',
artist: 'Mercy Chinwo',
id: 2, 
uri: "spotify:track:6rqhFgbbKwnb9MLmUQDhG7",
  },

  {

name: 'Commando',
album: 'Commando',
artist: 'Greatmantakit',
id: 3,
uri: "spotify:track:6rqhFgbbKwnb9MLmUQDhG8",
  }
]


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
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleLogin = () => {
    redirectToAuthCodeFlow();
  };

  const handleSearch = async (term) => {
    if (!term) return;
    setLoading(true);
    const results = await searchTracks(term);
    setSearchResults(results);
    setLoading(false);
  };

  const addTrack = (track) => {
    if (playlistSongs.find((saved) => saved.id === track.id)) return;
    setPlaylistSongs([...playlistSongs, track]);
  };

  const removeTrack = (track) => {
    setPlaylistSongs(playlistSongs.filter((saved) => saved.id !== track.id));
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    // Implement playlist saving to Spotify here (optional)
     savePlaylistToSpotify(playlistName, playlistSongs);
  setPlaylistName('');
  setPlaylistSongs([]);
    alert(`Saving playlist: ${playlistName} with ${playlistSongs.length} songs`);
  };

  if (loading) return <div>Loading...</div>;

  if (!loggedIn) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h1>Welcome to My Jammming App</h1>
        <button onClick={handleLogin}>Login with Spotify</button>
      </div>
    );
  }

  return (
    <div className={styles.app} style={{ maxWidth: 800, margin: '2rem auto' }}>

      <Header />
      <SearchBar onSearch={handleSearch} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <div style={{ flex: 1, marginRight: '1rem' }}>
          <SearchResult tracks={searchResults} onAdd={addTrack} />
        </div>
        <div style={{ flex: 1, marginLeft: '1rem' }}>
          <h2>Playlist</h2>
          <Playlist

            name={playlistName}
            playlistSongs={playlistSongs}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;

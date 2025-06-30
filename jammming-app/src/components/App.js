import React, {useState} from 'react';
import SearchResult from './searchresult';
import Playlist from './playlist';

const sampleTracks = [
  {
name: 'Waymaker',
album: 'Great God',
artist: 'Sinach',
id: 1,
  },

  {
   
name: 'Excess Love',
album: 'Satisfied',
artist: 'Mercy Chinwo',
id: 2, 
  },

  {

name: 'Commando',
album: 'Commando',
artist: 'Greatmantakit',
id: 3,
  }
]


function App() {
  const[searchResult, setSearchResult] = useState(sampleTracks);
  const[playlistNames, setPlaylistNames]= useState('');
      const[playlistTracks, setPlaylistTracks] =useState([])
  return (
    <div className="App">
      <SearchResult tracks={searchResult}/>
      <Playlist name={playlistNames}
       playlistSongs={playlistTracks}
       onNameChange={setPlaylistNames}/>
    </div>
  );
}

export default App;

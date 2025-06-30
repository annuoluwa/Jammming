import React, {useState} from 'react';
import Tracks from './track';


function Playlist({name, playlistSongs, onNameChange}) {
function handleChange(e) {
onNameChange(e.target.value)
}
return(
        <>
        <div className='playlist'>
            <input  value={name} onChange={handleChange}></input>
            {playlistSongs.map((track)=>(
                
    <Tracks 
    key={track.id}
    name={track.name}
    album={track.album}
    artist={track.artist}/>

            ))}
            <button> Save </button>
        </div>
        </>
    )
}

export default Playlist
import React from 'react';
import Tracks from './track';

function TrackList({tracks}) {

return(
    <>
    
    <div>

{tracks.map((track)=>(
    <Tracks 
    key={track.id}
    name={track.name}
    album={track.album}
    artist={track.artist}/>
))}
    </div>
    </>
)
};

export default TrackList;
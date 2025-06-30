import React from 'react';
import TrackList from './tracklist';


function SearchResult({tracks}) {
    return(
        <>
<TrackList tracks={tracks}/>
</>
    )
}

export default SearchResult
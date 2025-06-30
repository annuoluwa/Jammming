import React from 'react';


function Tracks({name, album, artist}) {
return(
    <>
    <div>
<h3>{name}</h3>
<p>{album} | {artist}</p>
    </div>
    </>
)
}

export default Tracks
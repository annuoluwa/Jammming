import React from 'react';
import Tracks from './track';

function TrackList({ tracks, onAdd, onRemove }) {
  return (
    <div>
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

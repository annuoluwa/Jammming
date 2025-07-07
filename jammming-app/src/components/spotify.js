const clientId = 'd92d63b0355c4454bd22269bce04c780';

// List your local IP addresses here (replace with your actual local IP)
const localIPs = ['127.0.0.1', '192.168.1.100']; // Add your real IP(s)
const hostname = window.location.hostname;

// Determine redirectUri dynamically
const redirectUri = localIPs.includes(hostname)
  ? `http://${hostname}:3000`  // local IP redirect URI, no trailing slash here to match your original
  : 'https://jammm2music.netlify.app'; // production URI

// Helper to generate random strings
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

// Generate code challenge from code verifier (PKCE)
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const scope = 'playlist-modify-public playlist-modify-private user-read-private';

// Called only when user clicks login
export async function redirectToAuthCodeFlow() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('code_verifier', codeVerifier);

  const state = generateRandomString(16);
  localStorage.setItem('pkce_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state,
  });

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
async function exchangeCodeForToken(code, codeVerifier) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await response.json();
  return data;
}

// Called once on app load to handle Spotify redirect and get token
export async function handleAuthRedirect() {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');
  const returnedState = queryParams.get('state');

  if (!code) {
    // No code in URL, nothing to do
    return;
  }

  const storedState = localStorage.getItem('pkce_state');

  if (!storedState || returnedState !== storedState) {
    console.error('State mismatch or missing code');
    return;
  }

  const codeVerifier = localStorage.getItem('code_verifier');

  if (!codeVerifier) {
    console.error('Missing code verifier');
    return;
  }

  const data = await exchangeCodeForToken(code, codeVerifier);

  if (data.access_token) {
    const expirationTime = new Date().getTime() + data.expires_in * 1000;

    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_expiration_time', expirationTime);

    // Clean up
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('pkce_state');

    console.log('Access token stored:', data.access_token);

    // Remove code and state from URL for a clean app URL
    window.history.replaceState({}, document.title, redirectUri);
  } else {
    console.error('Token exchange failed:', data);
  }
}
// Search Spotify tracks using saved access token
export async function searchTracks(term) {
  const token = localStorage.getItem('access_token');
  const expirationTime = localStorage.getItem('token_expiration_time');

  const isExpired = !token || !expirationTime || new Date().getTime() > Number(expirationTime);

  if (isExpired) {
    console.warn('Access token missing or expired. Redirecting to login...');
    await redirectToAuthCodeFlow(); // Automatically re-login
    return []; // Optional: return empty result to avoid errors during re-login
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!data.tracks) return [];

  return data.tracks.items.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    uri: track.uri
  }));
}


// Get the current Spotify user's ID
async function getCurrentUserId() {
  const token = localStorage.getItem('access_token');
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to get user ID');
  }

  const data = await response.json();
  return data.id;  // This is the Spotify user ID
}

// Create a new playlist with the specified name for the user
async function createPlaylist(userId, playlistName) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: playlistName,
      description: 'New playlist created from Jammming app',
      public: false  // You can set to true if you want it public
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create playlist');
  }

  const data = await response.json();
  return data.id;  // The new playlist ID
}

// Add tracks (URIs) to a playlist
async function addTracksToPlaylist(playlistId, trackUris) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: trackUris
    })
  });

  if (!response.ok) {
    throw new Error('Failed to add tracks to playlist');
  }

  return await response.json();
}

// The main function to save playlist with name and tracks
export async function savePlaylistToSpotify(playlistName, tracks) {
  if (!playlistName) {
    alert('Please enter a playlist name.');
    return;
  }
  if (!tracks.length) {
    alert('Add some tracks to the playlist before saving!');
    return;
  }

  try {
    const userId = await getCurrentUserId();
    const playlistId = await createPlaylist(userId, playlistName);
    const trackUris = tracks.map(track => track.uri);
    await addTracksToPlaylist(playlistId, trackUris);
    alert(`Playlist "${playlistName}" saved to your Spotify account!`);
  } catch (error) {
    console.error(error);
    alert('Something went wrong while saving the playlist.');
  }
}

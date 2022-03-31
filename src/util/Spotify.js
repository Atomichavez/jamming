const clientId = '390e000017db4fd1adffd9fca5834643'
const redirectUri = 'http://localhost:3000/'
// const redirectUri = 'http://jammingdavid.surge.sh'
let accessToken

const Spotify = {
  getAccessToken() {
    console.log('getting access token.......')
    if(accessToken) {
      console.log('access token obtained')
      return accessToken
    } 
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    if(accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1]
      const expiresIn = Number(expiresInMatch[1])
      window.setTimeout(() => accessToken = '', expiresIn * 1000)
      window.history.pushState('Access Token', null, '/')
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      window.location = accessUrl
    }
  },
  search(term) {
    console.log(term + 'spotify.js') ////////////////////////////////////////////
    const accessToken = Spotify.getAccessToken()
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return []
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }))
    })
  },
  async savePlaylist(name, trackUris) {
    if(!name || !trackUris.length) {
      return
    }
    
    //Getting token
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }

    //Getting user Id
    let userId = await fetch(`https://api.spotify.com/v1/me`, {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      console.log('This is the user ID' + jsonResponse.id)
      return jsonResponse.id})
    .catch((err) => {
      console.log('User id Fetch error')
    })
    
    //Creating Playlist
    let playlistId = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log('This is the playlist ID: ' + jsonResponse.id)
      return jsonResponse.id})
    .catch((err) =>{
      console.log('Error creating Playlist')
    })
    
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify({uris: trackUris}) 
      })
      .then((response) => console.log(trackUris))
      .catch((err) => console.log('Error while adding songs to the playlist'))
  }
}

export default Spotify

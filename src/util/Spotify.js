const clientId = '390e000017db4fd1adffd9fca5834643'
const redirectUri = 'http://localhost:3000/'
// const redirectUri = 'http://jammingdavid.surge.sh'
let urlPrefix = `https://api.spotify.com/v1/`
let accessToken

const Spotify = {
  getAccessToken() {
    console.log('getting access token.......')
    if(accessToken) {
      console.log('access token obtained')
      return accessToken
    } 
    console.log('access token line 14+')
    try {
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
      if(accessTokenMatch && expiresInMatch) {
        console.log('if') ///////////////////////////////////////////////////////////
        accessToken = accessTokenMatch[1]
        console.log(accessToken) ///////////////////////////////////////////////////////////
        const expiresIn = Number(expiresInMatch[1])
        console.log(expiresIn) ///////////////////////////////////////////////////////////
        window.setTimeout(() => accessToken = '', expiresIn * 1000)
        window.history.pushState('Access Token', null, '/')
      } else {
        console.log('else')
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
        window.location = accessUrl
      } 
    } catch(err) {
        console.log('Error getting token ' + err)}
  },
  async getUserId() {
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let userId = await fetch(`https://api.spotify.com/v1/me`, {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      console.log('This is the user ID' + jsonResponse.id)
      return jsonResponse.id})
    .catch((err) => {
      console.log('User id Fetch error')
    })
    return userId
  },
  async getPlaylistId(userId, name) {
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let playlistId = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log('This is the playlist ID' + jsonResponse.id)
      return jsonResponse.id
    })
    .catch((err) => {
      console.log('Error fetching playlist ID')
    })
    return playlistId
  },
  async search(term) {
    const accessToken = Spotify.getAccessToken()
    console.log('Search AccessToken obtained')
    console.log('This is the term: ' + term)
    let response = fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    if(!response.ok) {
      console.log('throw error....')
      throw new Error(`Error! status ${response.status}`)
    }
    let jsonResponse = await response.json()
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
    
    return fetch(urlPrefix + `search?type=track&q=${term}`, {
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
    }).catch((er) => {
      console.log('Error fetching search tracks')
    })
  },
  async savePlaylist(name, trackUris) {
    if(!name || !trackUris.length) {
      return
    }
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let userId = await this.getUserId()
    let playlistId = await this.getPlaylistId(userId, name)
    
    await fetch(urlPrefix + `playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify({uris: trackUris}) 
      })
      .then((response) => console.log(trackUris))
      .catch((err) => console.log('Error while adding songs to the playlist'))
  },
  async getUserPlaylists() {
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let userId = await this.getUserId()

    //no esta corriendo getUserId esta funcion...... ?
    return fetch(urlPrefix + `users/${userId}/playlists`, {headers: headers})
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(jsonResponse)
      jsonResponse.items.map(playlist => ({
        id: playlist.id, name: playlist.name 
      }))
    })
      .catch((err) => {
        console.log('Error fetching user old playlists')
      })
  }
}

export default Spotify

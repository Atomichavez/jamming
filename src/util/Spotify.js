import {v4 as uuidv4} from 'uuid';
const clientId = '390e000017db4fd1adffd9fca5834643'
// const redirectUri = 'http://localhost:3000/callback/'
const redirectUri = 'https://fanciful-platypus-9546ab.netlify.app'
let urlPrefix = `https://api.spotify.com/v1/`
let accessToken = undefined

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken
    } 
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
      if(accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1]
        const expiresIn = Number(expiresInMatch[1])
        window.setTimeout(() => accessToken = '', expiresIn * 1000)
        window.history.pushState('Access Token', null, '/')
        return accessToken
      } else {
        window.location =  `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      }
  },

  async getUserId() {
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let userId = await fetch(`https://api.spotify.com/v1/me`, {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
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
      return jsonResponse.id
    })
    .catch((err) => {
      console.log('Error fetching playlist ID')
    })
    return playlistId
  },

  async search(term) {
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`
    const accessToken = Spotify.getAccessToken()
    let response = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    if(!response.ok) {
      throw new Error(`Error status: ${response.status}`)
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
  },

  async savePlaylist(name, trackUris, id) {
    if(!name || !trackUris.length) {
      return
    }
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    if(!id) {
      let userId = await this.getUserId()
      let playlistId = await this.getPlaylistId(userId, name)
      fetch(urlPrefix + `playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          'Content-Type': 'application/json',
          body: JSON.stringify({uris: trackUris}) 
        })
        .then((response) => console.log(`New playlist created`))
        .catch((err) => console.log(`Error while adding songs to new playlist: ${err}`))
    } else {
      fetch(urlPrefix + `playlists/${id}/tracks`, {
        headers: headers,
        method: 'PUT',
        'Content-Type': 'application/json',
        body: JSON.stringify({uris: trackUris})
      })
      .catch((err) => console.log(`Error while modifying existing playlist: ${err}`))
    }
  },

  async getUserPlaylists() {
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let userId = await this.getUserId()

    let response = await fetch(urlPrefix + `users/${userId}/playlists?limit=50`, {headers: headers})
    if(!response.ok) {
      throw new Error(`Error status: ${response.status}`)
    }

    let jsonResponse = await response.json()
    if(!jsonResponse.items) {
      return []
    }
    return jsonResponse.items.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      key : uuidv4()
    }))
  },

  async getPlaylistTracks(playlistId) {
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let response = await fetch(urlPrefix + `playlists/${playlistId}/tracks`, {headers: headers})
    if(!response.ok) {
      throw new Error(`Error status: ${response.status}`)
    }
    let jsonResponse = await response.json()
    return jsonResponse.items.map(track => ({
      id: track.track.id,
      name: track.track.name,
      artist: track.track.artists[0].name,
      album: track.track.album.name,
      uri: track.track.uri
    }))
  },
  async changePlaylistName(newName, id) {
    const name = newName
    const accessToken = Spotify.getAccessToken()
    const headers = { Authorization: `Bearer ${accessToken}` }
    let response = await fetch(urlPrefix + `playlists/${id}`, {
      headers: headers,
      method: 'PUT',
      'Content-Type': 'application/json',
      body: JSON.stringify({name: name})})
    if(!response.ok) {
      throw new Error(`Error status: ${response.status}`)
    }
  }
}

export default Spotify

import './App.css';
import { SearchBar } from '../SearchBar/SearchBar'
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import React from 'react';
import Spotify from '../../util/Spotify';
import { AllPlaylists } from '../AllPlaylists/AllPlaylists';
import { v4 as uuidv4 } from 'uuid'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults:[],
      playlistName: 'New Playlist',
      playlistId: null,
      playlistUuid: null,
      playlistTracks: [],
      playlistItems: [],
      playlistToEdit: '',
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
    this.selectPlaylist = this.selectPlaylist.bind(this)
    this.updatePlaylistId = this.updatePlaylistId.bind(this)
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks
    if(tracks.find(currentTrack => currentTrack.id === track.id) === undefined) {
      tracks.push(track)
      this.setState({playlistTracks: tracks})
    }
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks
    tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id)
    this.setState({playlistTracks: tracks})
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }
  updatePlaylistId(id) {
    this.setState({playlistId: id})
  }
  savePlaylist(uuid) {
    const trackUris = this.state.playlistTracks.map(song => song.uri)
    Spotify.changePlaylistName(this.state.playlistName, this.state.playlistId)
    Spotify.savePlaylist(this.state.playlistName, trackUris, this.state.playlistId).then(() => {
      this.setState({playlistName: 'New Playlist'})
      this.setState({playlistTracks: []})
      this.setState({playlistUuid: uuid})
    })
    .then(()=> {
      this.setState({playlistID: null})
    })
  }
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }
  getUserPlaylists(){
    const playlists = Spotify.getUserPlaylists()
    this.setState({playlists: playlists})
  }
  async selectPlaylist(playlistToEdit) {
    const playlist = await Spotify.getPlaylistTracks(playlistToEdit.id)
    this.setState({playlistTracks: playlist})
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search}/>
          <div className="App-playlist">
            <AllPlaylists
              playlistTracks={this.state.playlistTracks}
              selectPlaylist = {this.selectPlaylist}
              updatePlaylistName = {this.updatePlaylistName}
              updatePlaylistId = {this.updatePlaylistId}/>
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}/>
            <Playlist 
              playlistName={this.state.playlistName}
              playlistId = {this.state.playlistId}
              playlistTracks={this.state.playlistTracks}
              playlistUuid={this.state.playlistUuid}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}
export default App;
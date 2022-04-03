import './App.css';
import { SearchBar } from '../SearchBar/SearchBar'
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import React from 'react';
import Spotify from '../../util/Spotify';
import { AllPlaylists } from '../AllPlaylists/AllPlaylists';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults:[],
      playlistName: '',
      playlistTracks: [],
      playlistItems: []
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
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
  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(song => song.uri)
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({playlistName: 'New Playlist'})
      this.setState({playlistTracks: []})
    })
  }
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }
  getPlaylistItems(){
    // Spotify.getUserPlaylists().then((playlists) => {
    //   this.setState({playlistItems:playlists})
    // })
    const playlists = Spotify.getUserPlaylists()
    this.setState({playlistItems: playlists})
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
              playlistItems={this.state.playlistItems}/>
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}/>
            <Playlist 
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
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
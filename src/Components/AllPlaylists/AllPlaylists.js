import '../App/App.css'
import './AllPlaylists.css'
import React from 'react'
import Spotify from '../../util/Spotify';
import { PlaylistItem } from '../PlaylistItem/PlaylistItem';
import { v4 as uuidv4 } from 'uuid'

export class AllPlaylists extends React.Component {
  constructor(props){
    super(props)
    this.state = {playlists: []}
  }

  async componentDidMount() {
    const playlists = await Spotify.getUserPlaylists()
    this.setState({playlists: playlists})
  }
  render() {
    return(
      <div className='AllPlaylists'>
        <h2>Existing Playlists</h2>
        {this.state.playlists.map((playlist) => <PlaylistItem
          playlist = {playlist}
          name = {playlist.name}
          key = {uuidv4()}
          id = {playlist.id}
          selectPlaylist = {this.props.selectPlaylist}
          updatePlaylistName = {this.props.updatePlaylistName}
          updatePlaylistId = {this.props.updatePlaylistId}/>)}
      </div>
    )
  }
}

import './AllPlaylists.css'
import React from 'react'
import Spotify from '../../util/Spotify';
import { PlaylistItem } from '../PlaylistItem/PlaylistItem';

export class AllPlaylists extends React.Component {
constructor(props){
  super(props)
  this.state = {playlists: []}
}

  async componentDidMount() {
    const playlists = await Spotify.getUserPlaylists()
    this.setState({playlists: playlists})
    console.log(this.state.playlists)
  }
  render() {
    return(
      <div>
        <h2>Existing Playlists</h2>
        {this.state.playlists.map((playlist) => <PlaylistItem
          name = {playlist.name}/>)}
      </div>
    )
  }
}

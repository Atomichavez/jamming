import './AllPlaylists.css'
import React from 'react'
import Spotify from '../../util/Spotify';
import { PlaylistItem } from '../PlaylistItem/PlaylistItem';

export class AllPlaylists extends React.Component {

  componentDidMount() {
    console.log(this.props.playlistItems)
  }
  render() {
    return(
      <div>
        <h2>Existing Playlists</h2>
        {this.props.playlistItems.map((playlist) => <PlaylistItem/>)}
      </div>
    )
  }
}

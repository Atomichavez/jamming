import './PlaylistItem.css'
import React from 'react'
export class PlaylistItem extends React.Component {
  constructor(props) {
    super(props)
    this.handleEdit = this.handleEdit.bind(this)
  }
  handleEdit() {
    this.props.updatePlaylistName(this.props.name)
    this.props.updatePlaylistId(this.props.id)
    this.props.selectPlaylist(this.props.playlist)
  }
  render() {
    return(
    <div className='PlaylistItem'> 
      <div className='PlaylistItem-information'>
        <h3>{this.props.name}</h3>
        <button 
          className='PlaylistItem-action'
          onClick={this.handleEdit}>
          Edit
        </button>
      </div>
    </div>
    )
  }
}



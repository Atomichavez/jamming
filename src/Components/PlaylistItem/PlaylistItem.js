import './PlaylistItem.css'
import React from 'react'

export class PlaylistItem extends React.Component {
  render() {
    return(<div> {this.props.playlist} </div>)
  }
}



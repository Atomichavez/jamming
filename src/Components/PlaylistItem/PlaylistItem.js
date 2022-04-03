import './PlaylistItem.css'
import React from 'react'

export class PlaylistItem extends React.Component {
  render() {
    return(
    <div> 
      <p>{this.props.name}</p>
      <p>{this.props.id}</p>
    </div>
    )
  }
}



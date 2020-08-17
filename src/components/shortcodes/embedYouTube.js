import PropTypes from 'prop-types'
import React from 'react'

const EmbedYouTube = ({ videoTitle, videoSrcURL }) => (
  <div className="PingCAP-Video-Wrapper">
    <iframe
      title={videoTitle}
      src={videoSrcURL}
      frameborder="0"
      allowfullscreen="allowfullscreen"
      mozallowfullscreen="mozallowfullscreen"
      msallowfullscreen="msallowfullscreen"
      oallowfullscreen="oallowfullscreen"
      webkitallowfullscreen="webkitallowfullscreen"
    ></iframe>
  </div>
)

EmbedYouTube.propTypes = {
  videoTitle: PropTypes.node.isRequired,
  videoSrcURL: PropTypes.node.isRequired,
}

export default EmbedYouTube

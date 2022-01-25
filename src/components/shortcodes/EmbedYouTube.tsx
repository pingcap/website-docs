import { wrapper } from './embed-youtube.module.scss'

interface Props {
  videoTitle: string
  videoSrcURL: string
}

export const EmbedYouTube = ({ videoTitle, videoSrcURL }: Props) => (
  <div className={wrapper}>
    <iframe
      title={videoTitle}
      src={videoSrcURL}
      frameBorder="0"
      allowFullScreen={true}
    />
  </div>
)

export default EmbedYouTube

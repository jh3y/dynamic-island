import React from 'react'
import styles from './dynamic-island.css'

const DynamicIsland = () => {
  const timerRef = React.useRef(null)
  const islandRef = React.useRef(null)
  const mediaRef = React.useRef(null)
  const infoRef = React.useRef(null)
  const scaleRef = React.useRef(null)
  const [info, setInfo]   = React.useState(null)
  const [media, setMedia] = React.useState(null)
  
  React.useEffect(() => {
    const processIsland = ({ detail: { info, media, timeout } }) => {
      setInfo(info)
      setMedia(media)

      // const winddown = () => {
      //   const tl = mediaRef.current.animate({
      //     scale: 0
      //   }, {
      //     duration: 200,
      //     fill: 'forwards'
      //   })
      //   infoRef.current.animate({
      //     opacity: 0,
      //   }, {
      //     duration: 200,
      //     fill: 'forwards'
      //   })
      //   tl.finished.then(() => {
      //     setInfo(null)
      //     setMedia(null)
      //   })
      // }

      // if (timeout) {
      //   if (timerRef.current) clearTimeout(timerRef.current)
      //   timerRef.current = setTimeout(winddown, timeout)
      // }
    }
    document.body.addEventListener('island:event', processIsland)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      document.body.removeEventListener('island:event', processIsland)
    }
  }, [])
  
  React.useEffect(() => {
    const { width } = islandRef.current.getBoundingClientRect()
    islandRef.current.style.setProperty('--width-imposed', width)
  }, [info])

  return (
    <>
      <div ref={islandRef} className="dynamic-island">
        {info ? <div ref={infoRef} className="dynamic-island__info">{info}</div> : null}
        {media ? <div ref={mediaRef} className="dynamic-island__media" dangerouslySetInnerHTML={{__html: media}}></div> : null}
      </div>
      <span id="transmitter"></span>
    </>
  )
}

export default DynamicIsland
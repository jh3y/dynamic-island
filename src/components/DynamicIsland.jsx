import React from 'react'
import styles from './dynamic-island.css'

import lens from './lens.png'

const DynamicIsland = () => {
  const timerRef = React.useRef(null)
  const islandRef = React.useRef(null)
  const mediaRef = React.useRef(null)
  const infoRef = React.useRef(null)
  const centerRef = React.useRef(null)
  const scaleRef = React.useRef(null)
  const cbRef = React.useRef(null)
  const [info, setInfo]   = React.useState(null)
  const [media, setMedia] = React.useState(null)
  const [box, setBox] = React.useState(null)
  
  React.useEffect(() => {
    const winddown = () => {
      const anims = []
      
      if (mediaRef.current)
        anims.push(mediaRef.current.animate({
          scale: 0
        }, {
          duration: 200,
          fill: 'forwards'
        }).finished)
      if (infoRef.current)
        anims.push(infoRef.current.animate({
          opacity: 0,
        }, {
          duration: 200,
          fill: 'forwards'
        }).finished)
      if (centerRef.current)
        anims.push(centerRef.current.animate({
          opacity: 0,
        }, {
          duration: 200,
          fill: 'forwards'
        }).finished)
      if (anims.length) {
        Promise.all(anims).then(() => {
          setInfo(null)
          setMedia(null)
          setBox(null)
        })
      }
    }
    const processIsland = ({ detail: { box, info, media, timeout, cb, nuke } }) => {
      if (nuke) return winddown()
      
      setInfo(info)
      setMedia(media)
      setBox(box)
      cbRef.current = cb

      if (timeout) {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(winddown, timeout)
      }
    }
    document.body.addEventListener('island:event', processIsland)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      document.body.removeEventListener('island:event', processIsland)
    }
  }, [])
  
  React.useEffect(() => {
    if (media || info) {
      const { width: leftWidth } = islandRef.current.querySelector('.dynamic-island__stage--left').getBoundingClientRect()
      const { width: rightWidth } = islandRef.current.querySelector('.dynamic-island__stage--right').getBoundingClientRect()
      if (Math.max(leftWidth, rightWidth) !== 0) islandRef.current.style.setProperty('--auxiliary-width', `${Math.floor(Math.max(leftWidth, rightWidth))}px`)      
    } else {
      islandRef.current.style.setProperty('--auxiliary-width', '1fr')
    }
    const { height, width } = islandRef.current.getBoundingClientRect()
    islandRef.current.style.setProperty('--width-imposed', width)
    islandRef.current.style.setProperty('--height-imposed', height)
    if (cbRef.current) {
      cbRef.current()
      const { height, width } = islandRef.current.getBoundingClientRect()
      islandRef.current.style.setProperty('--width-imposed', width)
      islandRef.current.style.setProperty('--height-imposed', height)
      cbRef.current = null
    }
  }, [info, media, box])

  return (
    <>
      <div ref={islandRef} className="dynamic-island">
        <div className="dynamic-island__stage dynamic-island__stage--left">
          {info ? <div ref={infoRef} className="dynamic-island__info" dangerouslySetInnerHTML={{__html: info}}></div> : null}
        </div>
        <div className="dynamic-island__stage dynamic-island__stage--camera">
          <img className="dynamic-island__lens" src={lens} />
        </div>
        <div className="dynamic-island__stage dynamic-island__stage--right">
          {media ? <div ref={mediaRef} className="dynamic-island__media" dangerouslySetInnerHTML={{__html: media}}></div> : null}
        </div>
        <div className="dynamic-island__stage dynamic-island__stage--center">
          {box ? <div ref={centerRef} className="dynamic-island__center" dangerouslySetInnerHTML={{__html: box}}></div> : null}
        </div>
      </div>
      <span id="transmitter"></span>
    </>
  )
}

export default DynamicIsland
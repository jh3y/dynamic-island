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
  const sizingRef = React.useRef(null)
  const timerCbRef = React.useRef(null)
  const [info, setInfo]   = React.useState(null)
  const [media, setMedia] = React.useState(null)
  const [box, setBox] = React.useState(null)
  
  React.useEffect(() => {
    const winddown = () => {
      const anims = []
      if (timerCbRef.current) {
        timerCbRef.current()
        timerCbRef.current = null
      }
      if (mediaRef.current)
        anims.push(mediaRef.current.animate({
          opacity: 0
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
    const processIsland = ({ detail: { box, info, media, timeout, cb, nuke, timerCb } }) => {
      if (nuke) return winddown()
      
      setInfo(info)
      setMedia(media)
      setBox(box)
      cbRef.current = cb
      timerCbRef.current = timerCb

      if (timerRef.current) {
        clearTimeout(timerRef.current)
        document.querySelector('.dynamic-island').style.setProperty('--island', 0)
      }
      if (timeout) {
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
    islandRef.current.style.removeProperty('--auxiliary-width')
    islandRef.current.style.removeProperty('--width-imposed')
    islandRef.current.style.removeProperty('--height-imposed')
    // Animate the things in
    if (mediaRef.current) {
        mediaRef.current.animate([
        {
          opacity: 0
        },
        {
          opacity: 1
        }
      ], {
        fill: 'both',
        duration: 200,
        delay: 100,
      })
    } 
    if (infoRef.current) {
      infoRef.current.animate([
        { opacity: 0}, {opacity: 1}
      ], {
        fill: 'both',
        duration: 200,
        delay: 100,
      })
    }
    if (centerRef.current) {
      centerRef.current.animate([
        { opacity: 0}, {opacity: 1}
      ], {
        fill: 'both',
        duration: 200,
        delay: 100,
      })
    }
    if (cbRef.current) {
      cbRef.current()
      cbRef.current = null
    }

  }, [info, media, box])

  React.useEffect(() => {
    const update = entries => {
      if (!entries.length) return

      const { width: leftWidth } = islandRef.current.querySelector('.dynamic-island__stage--left').getBoundingClientRect()
      const { width: rightWidth } = islandRef.current.querySelector('.dynamic-island__stage--right').getBoundingClientRect()
      const { height, width } = islandRef.current.getBoundingClientRect()
      
      if (Math.max(leftWidth, rightWidth) !== 0) islandRef.current.style.setProperty('--auxiliary-width', `${Math.floor(Math.max(leftWidth, rightWidth))}px`)      
      
      islandRef.current.style.setProperty('--width-imposed', Math.floor(width))
      islandRef.current.style.setProperty('--height-imposed', Math.floor(height))
    }
    const islandObserver = new ResizeObserver(update)
    islandObserver.observe(sizingRef.current)
    return () => {
      islandObserver.unobserve(sizingRef.current)
    }
  }, [])
  

  return (
    <>
      <div ref={islandRef} className="dynamic-island">
        <div ref={sizingRef} className="dynamic-island__stage dynamic-island__stage--left">
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
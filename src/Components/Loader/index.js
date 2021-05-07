import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames'
import globalStore, { setLoaderState } from "../../stores";

import st from './index.module.scss'

const PRELOADER_END = 0;
const PRELOADER_START = 1;
const PRELOADER_HIDE = 4;
let delay = 10
const cssDelay = 400

const Animation = ({
  end,
  position,
  style = {},

  onEnd
}) => {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let timeout;

    if(percent > 40) delay = 25;

    if(percent < 85){
      timeout = setTimeout(() => {
        setPercent((prev) => end ? 100 : prev + 0.1)
      }, percent == 0 ? 10 : delay)
    }

    return () => {
      percent < 85 && clearTimeout(timeout)
    }
  })

  useEffect(() => {
    end && setTimeout(() => onEnd(), delay + cssDelay);
  }, [end])

  return (
    <div
      className={cx(
        st.rcProgressBar,
        position == 'top' ? st.preloaderTop : st.preloaderBottom
      )}
      style={style}
    >
      <div
        style={{ width: percent + '%', backgroundColor: "#64B904", height: 6 }}
        className={st.preloader}
      />
    </div>
  )
}

const Preloader = ({
  start,
  position,
  style
}) => {
  const [loaderStatus, setLoaderStatus] = useState(false)

  const onEndAfterDelay = () => {
    setLoaderStatus(false)
  }

  useEffect(() => {
    start && setLoaderStatus(true)
    // if(start && !loaderStatus){
    //   setLoaderStatus(PRELOADER_START)
    // }
    // else if(!start && loaderStatus){
    //   setLoaderStatus(PRELOADER_END)
    // }
    // startRef.current = start;
  }, [start])

  useEffect(() => {
    return () => setLoaderStatus(false)
  }, [])

  if(!loaderStatus){
    return null;
  }

  return (
    <Animation
      end={loaderStatus && !start}
      onEnd={onEndAfterDelay}
      position={position}
      style={style}
    />
  )
}

export default Preloader;
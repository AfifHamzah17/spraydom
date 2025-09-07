// FILE: src/components/VideoPlayerCustom.jsx
import React from 'react'
import ReactPlayer from 'react-player'


export default function VideoPlayerCustom({ url, poster }) {
return (
<div className="bg-black rounded-xl overflow-hidden shadow">
<ReactPlayer url={url} controls width="100%" height="360px" light={poster} />
</div>
)
}
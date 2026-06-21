import React, { useRef, useEffect } from 'react';

export default function VideoPlayerRenderer({ lesson, onComplete }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [lesson]);

  return (
    <div className="w-100 bg-dark rounded-4 overflow-hidden shadow-sm" style={{ aspectRatio: '16/9' }}>
      <video
        ref={videoRef}
        src={lesson.media_url}
        className="w-100 h-100 object-fit-contain"
        controls
        controlsList="nodownload"
        onEnded={() => onComplete()}
        autoPlay
      >
        Your browser does not support HTML video.
      </video>
    </div>
  );
}

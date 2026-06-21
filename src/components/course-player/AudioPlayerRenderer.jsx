import React, { useRef, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { BsMusicNoteBeamed } from 'react-icons/bs';

export default function AudioPlayerRenderer({ lesson, onComplete }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [lesson]);

  return (
    <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-light">
      <div className="mb-4 d-inline-flex p-4 rounded-circle bg-primary bg-opacity-10">
        <BsMusicNoteBeamed size={50} className="text-primary" />
      </div>
      <h4 className="fw-bold mb-4">{lesson.title}</h4>
      <div className="d-flex justify-content-center">
        <audio
          ref={audioRef}
          src={lesson.media_url}
          controls
          controlsList="nodownload"
          className="w-100"
          style={{ maxWidth: '500px' }}
          onEnded={() => onComplete()}
          autoPlay
        >
          Your browser does not support HTML audio.
        </audio>
      </div>
    </Card>
  );
}

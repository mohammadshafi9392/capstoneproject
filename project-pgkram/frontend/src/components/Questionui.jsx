// Questionui.jsx

import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';

const Questionui = ({ question }) => {
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const toggleRecording = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      const newRecorder = new RecordRTC(stream, { type: 'video' });
      setRecorder(newRecorder);

      newRecorder.startRecording();
    } else {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setRecordedVideoBlob(blob);

        previewVideoRef.current.src = URL.createObjectURL(blob);
      });
    }

    // Toggle recording state
    setRecording(!recording);
  };

  // Reset recorded video blob when the question changes
  React.useEffect(() => {
    setRecordedVideoBlob(null);
  }, [question]);

  return (
    <div className="flex flex-col items-center">
      <div className="my-4">{question}</div>

      {/* Live recording at the center */}
      <div className="flex flex-col items-center mt-4">
        <div>
          <video ref={videoRef} width="600" height="450" controls autoPlay muted></video>
        </div>

        {/* Record button */}
        <button className={`bg-[#ED9017] py-2 px-4 rounded-lg text-white mt-2`} onClick={toggleRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {/* Preview below the live video */}
      {recordedVideoBlob && (
        <div className="mt-4">
          <h3>Preview</h3>
          <video ref={previewVideoRef} width="600" height="450" controls src={URL.createObjectURL(recordedVideoBlob)}></video>
        </div>
      )}
    </div>
  );
};

export default Questionui;

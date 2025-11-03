import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Capture = () => {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const retakePhoto = () => setPhoto(null);

  const savePhoto = () => {
    localStorage.setItem("capturedPhoto", photo);
    navigate("/report");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-green-600 cursor-pointer"
            onClick={() => navigate("/report")}
          />
          <h2 className="ml-4 text-2xl font-semibold text-green-700">
            Capture Issue Photo
          </h2>
        </div>

        {!photo ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-xl border shadow"
          />
        ) : (
          <img src={photo} alt="Captured" className="rounded-xl border shadow" />
        )}

        <div className="flex justify-center mt-4 gap-4">
          {!photo ? (
            <button
              onClick={capturePhoto}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              Capture
            </button>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                className="bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500"
              >
                Retake
              </button>
              <button
                onClick={savePhoto}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
              >
                Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Capture;

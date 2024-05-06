import React, { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";

interface HandTrackerProps {
  onHandMove: (rotation: [number, number]) => void; // Update type to reflect X and Y values
}

const HandTracker: React.FC<HandTrackerProps> = ({ onHandMove }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadHandposeModel = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const model = await handpose.load();
    video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    video.addEventListener("loadeddata", () =>
      detectHand(model, video, canvas)
    );
  };

  const detectHand = async (
    model: handpose.HandPose,
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement
  ) => {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const context = canvas.getContext("2d");
      context!.clearRect(0, 0, canvas.width, canvas.height);

      const hand = predictions[0];
      const landmarks = hand.landmarks;
      drawLandmarks(context!, landmarks);

      // Assuming landmarks[0] is the primary landmark for rotation
      const rotation: [number, number] = [landmarks[0][0], landmarks[0][1]]; // X and Y positions
      onHandMove(rotation);
    }

    requestAnimationFrame(() => detectHand(model, video, canvas));
  };

  const drawLandmarks = (
    context: CanvasRenderingContext2D,
    landmarks: number[][]
  ) => {
    context.fillStyle = "red";
    for (let i = 0; i < landmarks.length; i++) {
      const [x, y] = landmarks[i];
      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fill();
    }
  };

  useEffect(() => {
    loadHandposeModel();
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        // Set canvas dimensions to match the video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial resize
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        style={{
          visibility: "visible",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "20%",
          //   height: "10%",
        }}
        autoPlay
      />
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "20%",
          //   height: "30%",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

export default HandTracker;

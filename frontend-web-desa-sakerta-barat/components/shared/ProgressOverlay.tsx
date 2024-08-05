import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import waitingAnimation from '../../public/assets/animation/waiting-animation.json'; // You'll need to download this JSON file

const ProgressOverlay = ({ isLoading, action }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 2, 99);
          return newProgress;
        });
      }, 100);

      return () => clearInterval(timer);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-card w-96 max-w-[90%]">
        <div className="w-fit h-fit mx-auto mb-1">
          <Lottie animationData={waitingAnimation} loop={true} />
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
            ></div>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold inline-block text-blue-600 dark:text-blue-400">
              {progress}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
          Mohon tunggu sebentar...
        </p>
      </div>
    </div>
  );
};

export default ProgressOverlay;

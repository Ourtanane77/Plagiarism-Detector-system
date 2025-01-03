import React, { useEffect, useState } from "react";

const Loader = () => {
  const [dots, setDots] = useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-gray-200 border-l-gray-200 animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-t-blue-500 border-r-gray-200 border-b-gray-200 border-l-gray-200 animate-spin-slow" />
        </div>
        <p className="text-xl font-medium text-gray-700">
          Analyzing your document{dots}
        </p>
      </div>
    </div>
  );
};

export default Loader;
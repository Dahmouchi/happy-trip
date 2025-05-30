import React from "react";

const Loading = () => {
  return (
    <div className="min-w-3xl h-screen flex items-center justify-center">
      <div
        className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-green-500 rounded-full dark:text-green-400"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;

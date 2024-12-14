import React from "react";

const Loading = () => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
      <div className='w-16 h-16 border-4 border-black border-t-primary border-r-transparent border-b-secondary border-l-transparent rounded-full animate-spin'></div>
    </div>
  );
};

export default Loading;

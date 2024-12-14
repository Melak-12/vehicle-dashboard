import React from "react";
import { FaBell } from "react-icons/fa";

function Header() {
  return (
    <header className='bg-primary text-white p-5 flex justify-between items-center'>
      <h1 className='m-0 text-2xl'>Vehicle Management Dashboard</h1>
      <div className='relative'>
        <FaBell size={24} />
        <span className='absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full'></span>
      </div>
    </header>
  );
}

export default Header;

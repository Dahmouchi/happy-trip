import React from 'react';

export function SearchInput() {
  return (
    <div className="relative w-full max-w-7xl z-10">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
     <div className='rounded-bl-full rounded-r-full h-full bg-gradient-to-b from-[#8EBD22] to-[#d0f47c] px-3 text-white p-2 absolute right-0 top-0'>
        Rechercher
     </div>
    </div>
  );
}
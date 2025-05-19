import React from 'react';

export function SearchInput() {
  return (
    <div className="relative w-full max-w-xl z-10 lg:h-12">
      <input
      type="text"
      placeholder="Search..."
      className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 h-full pr-20"
      />
      <button className="rounded-bl-full rounded-r-full h-full bg-gradient-to-b from-[#8EBD22] to-[#d0f47c] px-3 text-white absolute right-0 top-0 flex items-center justify-center">
      Rechercher
      </button>
    </div>
  );
}
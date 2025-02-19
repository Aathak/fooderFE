"use client";

import { useState } from 'react';

interface MenuButtonsProps {
  menuId: number;  // Changed from string to number
}

const MenuButtons = ({ menuId }: MenuButtonsProps) => {
  const [quantity, setQuantity] = useState(0);

  const handleDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 0));
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <div className="mt-3 flex items-center space-x-3">
      <button 
        className="px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 transition-colors"
        onClick={handleDecrement}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="text-lg font-semibold">{quantity}</span>
      <button 
        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default MenuButtons;
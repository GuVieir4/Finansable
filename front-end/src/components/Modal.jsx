import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return(
    <div className='fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40' 
      onClick={onClose}>
      <div className='bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 relative' 
        onClick={(event) => event.stopPropagation()}> 
        <button onClick={onClose} className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'><i class="fa-solid fa-xmark"></i></button>
        {children}        
      </div>
    </div>
  )
}


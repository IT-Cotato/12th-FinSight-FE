'use client';

import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ 
  text, 
  onClick, 
  disabled = false 
}: ButtonProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '34px',
        left: '20px',
        right: '20px',
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%',
          height: '60px',
          borderRadius: '12px',
          backgroundColor: disabled 
            ? 'var(--color-primary-20, #C5BBFB)' 
            : 'var(--color-primary-50, #5C54F5)',
          color: 'var(--color-gray-10)',
          fontSize: '16px',
          fontWeight: 500,
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {text}
      </button>
    </div>
  );
}
'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function Step({ 
  currentStep, 
  totalSteps 
}: StepIndicatorProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '104px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => (
        <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
          {/* 원 */}
          <div
            className="rounded-full"
            style={{
              width: '25px',
              height: '25px',
              backgroundColor: num === currentStep ? '#5B53F3' : '#2A2A3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: num === currentStep ? 'white' : '#909090',
              fontSize: '14px',
              fontWeight: num === currentStep ? 600 : 400,
            }}
          >
            {num}
          </div>
          
          {/* 선 */}
          {num < totalSteps && (
            <div 
              style={{
                width: '25px',
                height: '2px',
                backgroundColor: '#2A2A3E',
                marginLeft: '3px',
                marginRight: '3px',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
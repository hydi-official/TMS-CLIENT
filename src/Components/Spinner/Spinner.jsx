import React from 'react';

// Color palette from your configuration
const COLORS = {
  primary: '#00838F',
  secondary: '#E67E22',
  accent: '#D32F2F',
  dark: '#0F3057',
  light: '#26A69A',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F5F7FA',
    200: '#E4E7EB',
    300: '#CBD2D9',
    600: '#616E7C',
    800: '#323F4B'
  }
};

// Spinner 1: Circular Spinner
export const CircularSpinner = ({ 
  color = COLORS.primary, 
  size = 50, 
  thickness = 4 
}) => (
  <div 
    style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh'
    }}
  >
    <div 
      style={{
        width: `${size}px`, 
        height: `${size}px`, 
        border: `${thickness}px solid ${color}`, 
        borderTop: `${thickness}px solid ${COLORS.light}`, 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite'
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Spinner 2: Dot Loader
export const DotLoader = ({ 
  color = COLORS.primary, 
  size = 20 
}) => (
  <div 
    style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh'
    }}
  >
    <div style={{ display: 'flex', gap: '10px' }}>
      {[1, 2, 3].map((dot) => (
        <div 
          key={dot}
          style={{
            width: `${size}px`, 
            height: `${size}px`, 
            borderRadius: '50%', 
            backgroundColor: color,
            animation: `bounce 0.5s ease-in-out infinite alternate`,
            animationDelay: `${dot * 0.1}s`
          }}
        />
      ))}
    </div>
    <style>{`
      @keyframes bounce {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
      }
    `}</style>
  </div>
);

// Spinner 3: Pulsing Bar Loader
export const BarLoader = ({ 
  color = COLORS.primary, 
  width = 200, 
  height = 10 
}) => (
  <div 
    style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh'
    }}
  >
    <div 
      style={{
        width: `${width}px`, 
        height: `${height}px`, 
        backgroundColor: COLORS.gray[200],
        borderRadius: '5px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div 
        style={{
          width: '30%', 
          height: '100%', 
          backgroundColor: color,
          position: 'absolute',
          animation: 'slide 1.5s infinite',
          borderRadius: '5px'
        }}
      />
    </div>
    <style>{`
      @keyframes slide {
        0% { left: -30%; }
        50% { left: 100%; }
        100% { left: -30%; }
      }
    `}</style>
  </div>
);

export default { CircularSpinner, DotLoader, BarLoader };
import React, { useState, useEffect } from 'react';

interface BackgroundContainerProps {
  children: React.ReactNode;
  mood?: string;
}

export const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ children, mood = 'random-neon' }) => {
  const [backgroundMood] = useState(mood);

  useEffect(() => {
    document.body.setAttribute('data-mood', backgroundMood);
    return () => {
      document.body.removeAttribute('data-mood');
    };
  }, [backgroundMood]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="mesh-gradient" />
      <div className="gradient-orb" />
      {children}
    </div>
  );
}; 
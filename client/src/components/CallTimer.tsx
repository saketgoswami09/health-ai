import React, { useEffect, useState } from 'react';

interface Props {
  isActive: boolean;
}

export const CallTimer: React.FC<Props> = ({ isActive }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-xl font-mono text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
      {formatTime(seconds)}
    </div>
  );
};

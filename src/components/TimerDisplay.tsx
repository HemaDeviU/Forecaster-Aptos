import React from 'react';

interface TimerDisplayProps {
  timer: number; // Specify the type of the timer prop
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
  return (
    <div>
      <h2 className="text-white">Time Remaining: {timer}</h2>
    </div>
  );
};

export default TimerDisplay;
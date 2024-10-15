'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PredictionCard from "@/components/PredictionCard";

const Home = () => {
  // Timer state
  const [timer, setTimer] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [secondTimer, setSecondTimer] = useState(5); // New timer state
  const [isSecondTimerActive, setIsSecondTimerActive] = useState(false); // State for second timer


  // Countdown effect for the timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined; // Initialize as undefined

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false); // Stop the timer
      setSecondTimer(5); // Reset second timer to 5 seconds
      setIsSecondTimerActive(true); // Start second timer
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isTimerActive, timer]);

  // Countdown effect for the second timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isSecondTimerActive && secondTimer > 0) {
      interval = setInterval(() => {
        setSecondTimer(prevSecondTimer => prevSecondTimer - 1);
      }, 1000);
    } else if (secondTimer === 0) {
      setIsSecondTimerActive(false); // Stop the second timer when it reaches 0
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isSecondTimerActive, secondTimer]);

  const resetTimers = () => {
    setTimer(10);
    setSecondTimer(5);
    setIsTimerActive(true);
    setIsSecondTimerActive(false);
  };

  return (
    <div className="w-full">
      <main className="flex flex-col gap-4 px-8">
        <div className="flex justify-between items-center">
          <Button className="currency-button font-black text-lg text-white px-4 py-2 rounded-full pointer-events-none">BTCUSD</Button>
          <div className="timer-display text-white bg-lighter px-4 py-2 rounded-full w-[110px] flex items-center">
            {isSecondTimerActive ? (
                <p>{`00:${String(secondTimer).padStart(2, '0')}`}</p>
              ) : (
                <p>{`00:${String(timer).padStart(2, '0')}`}</p>
              )}
              <img src="images/hourglass1.png" alt="hourglass timer 3d icon" className='hourglass' />
          </div>
        </div>
        <PredictionCard timer={timer} secondTimer={secondTimer} isTimerActive={isTimerActive} isSecondTimerActive={isSecondTimerActive} resetTimers={resetTimers} />
      </main>
    </div>
  );
};

export default Home;
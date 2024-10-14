'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import PredictionCard from "@/components/PredictionCard";

const Home = () => {
  // Timer state
  const [timer, setTimer] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [secondTimer, setSecondTimer] = useState(5); // New timer state
  const [isSecondTimerActive, setIsSecondTimerActive] = useState(false); // State for second timer


  // Countdown effect for the timer
  useEffect(() => {
    let interval = null;

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
    let interval = null;

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
    <div className="font-[family-name:var(--font-geist-sans)] w-full">
      <main className="flex flex-col gap-4">
        <Button className="bg-lighter text-white px-4 py-2 rounded-full hover:bg-blue-600">APTUSD</Button>
        <div className="timer-display text-white">
        {isSecondTimerActive ? (
            <p>{`Timer 2: 00:${String(secondTimer).padStart(2, '0')}`}</p>
          ) : (
            <p>{`Timer 1: 00:${String(timer).padStart(2, '0')}`}</p>
          )}
         </div>
          <PredictionCard timer={timer} secondTimer={secondTimer} isTimerActive={isTimerActive} isSecondTimerActive={isSecondTimerActive} resetTimers={resetTimers} />
         </main>
    </div>
  );
};

export default Home;
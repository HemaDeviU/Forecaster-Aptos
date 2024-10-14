"use client";

import { useState, useEffect } from 'react';
import { Input } from '/Users/stepome/Documents/Code/Aptos-Code-Collision/Aptos-frontend/src/components/ui/input'
import { ArrowUp } from 'lucide-react';

const PredictionCard = ({ timer, secondTimer, isTimerActive, isSecondTimerActive })  => {
  // Manage state for user choice and form progression
  const [step, setStep] = useState(1); // Initial step (choose UP/DOWN)
  const [prediction, setPrediction] = useState(null); // Track whether UP or DOWN is selected
  const [betAmount, setBetAmount] = useState(''); // Track bet amount
  const [isConnected, setIsConnected] = useState(false); 
  const [isPredictionConfirmed, setIsPredictionConfirmed] = useState(false); // Track if the user confirmed their prediction
  const [hasWon, setHasWon] = useState(null); // Track if the user won



  // Handle the button click for UP/DOWN prediction
  const handlePrediction = (choice) => {
    setPrediction(choice); // Set user choice to UP or DOWN
    setStep(2); // Move to the next step (bet amount + connect wallet)
  };

  // Handle the bet amount input change
  const handleAmountChange = (e) => {
    setBetAmount(e.target.value); // Set bet amount
  };

  // Simulate wallet connection
  const handleConnect = () => {
    setIsConnected(true); // Simulate wallet being connected
  };

  // Simulate an Upward prediction result when secondTimer starts
  useEffect(() => {
    if (isSecondTimerActive && secondTimer > 0 && isPredictionConfirmed) {
      // Simulate that the price goes up after the second timer starts
      if (prediction === 'UP') {
        setHasWon(true); // User wins if they predicted UP
      } else {
        setHasWon(false); // User loses if they predicted DOWN
      }
    }
  }, [isSecondTimerActive, secondTimer, prediction, isPredictionConfirmed]);


  const upButtonLabel = () => {
    if (timer === 0) {
      return 'UP';
    }
    if (isPredictionConfirmed && prediction === 'UP') {
      return 'Entered UP';
    }
    return 'Enter UP';
  };

  const downButtonLabel = () => {
    if (timer === 0) {
      return 'DOWN';
    }
    if (isPredictionConfirmed && prediction === 'DOWN') {
      return 'Entered DOWN';
    }
    return 'Enter DOWN';
  };

  return (
    <div className="card">
      {/* Step 4: Render the card content based on the current step */}
      {step === 1 && (
        <div className="prediction-step bg-lighter rounded-2xl overflow-hidden text-white">
            <div className='card-header bg-accent p-4 flex justify-between'>
                <p> {isSecondTimerActive ? "Live" : secondTimer === 0 ? "Expired" : "Next"} </p>
                    {/* Display entered prediction if confirmed */}
                    {isPredictionConfirmed && prediction && timer === 0 && (
                    <p>Entered {prediction}</p>
                    )}
            </div>
            <div className='card-content flex flex-col px-4 pt-4 pb-6 gap-6 relative'>
                <button onClick={() => handlePrediction('UP')} className='up-button w-full relative mb-2 '>
                    <svg width="100%" height="auto" viewBox="0 0 250 88" fill="none" style={{ filter: "drop-shadow(0px 10px 0px #1B5887)" }}  xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 64.2854C0 56.2042 4.86333 48.917 12.326 45.8163L117.326 2.18855C122.238 0.147439 127.762 0.14744 132.674 2.18855L237.674 45.8163C245.137 48.917 250 56.2042 250 64.2854V73C250 81.2843 243.284 88 235 88H15C6.71573 88 0 81.2843 0 73V64.2854Z" fill="#1FD690"/>
                    </svg> 
                    <div className='flex flex-col justify-center items-center absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <p>{upButtonLabel()}</p>
                        <p>Payout 1.5X</p>
                    </div>
                </button>   

                {/* Conditional rendering of content based on timer state */}
                {timer > 0 ? (
                    <div>
                    {/* Content for when the timer is running */}
                        <div className='central-info border-accent rounded-2xl p-4'>
                            <div className='card-header flex justify-between'>
                                <p>Prize Pool</p>
                                <p>42.3 APT</p>
                            </div>  
                        </div>  
                    </div>
                ) : (
                    <div>
                    {/* Content for when the timer is over */}
                        <div className='central-info border-accent rounded-2xl p-4 flex flex-col gap-4'>
                            <div>
                                <p>Last Price</p>
                                <div className='flex justify-between items-center'>
                                    <p className='text-[24px] font-bold'>$10,13</p>
                                    <div className='flex bg-[#1FD690] rounded-xl p-2'><ArrowUp size={24} color="#fff" /> {/* Customize size and color */}<p>$0,421</p></div>
                                </div>
                            </div>
                            <div>
                                <div className='card-header flex justify-between'>
                                    <p>Locked Price</p>
                                    <p>$10,10 APT</p>
                                </div> 
                                <div className='card-header flex justify-between'>
                                    <p>Prize Pool</p>
                                    <p>42.3 APT</p>
                                </div> 
                            </div>  
                        </div> 
                    </div>
                )}

            

                <button onClick={() => handlePrediction('DOWN')} className='down-button relative'>
                    <svg width="100%" height="auto" viewBox="0 0 250 88" fill="none" style={{ filter: "drop-shadow(0px 10px 0px #542784)" }} xmlns="http://www.w3.org/2000/svg">
                        <path d="M250 23.7146C250 31.7958 245.137 39.083 237.674 42.1838L132.674 85.8114C127.762 87.8525 122.238 87.8525 117.326 85.8114L12.326 42.1837C4.86331 39.083 -2.48014e-05 31.7958 -2.40949e-05 23.7146L-2.3333e-05 15C-2.26088e-05 6.71573 6.71571 6.6592e-07 15 1.39015e-06L235 2.06232e-05C243.284 2.13474e-05 250 6.71575 250 15L250 23.7146Z" fill="#EF4D9B"/>
                    </svg>
                    <div className='flex flex-col justify-center items-center absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <p>{downButtonLabel()}</p>
                        <p>Payout 1.5X</p>
                    </div>
                </button>


                {secondTimer === 0 && (
                <div className='absolute top-0 left-0 w-full h-full bg-lighter flex items-center justify-center'>
                    <p>{hasWon === null ? "Waiting for result..." : hasWon ? "You have won!" : "You lost."}</p>
                </div>
                )}

            </div>
        </div>
      )}

      {step === 2 && (
        <div className="bet-step bg-lighter rounded-2xl overflow-hidden text-white">
            <div className='card-header bg-accent p-4 flex justify-between'>
                <button onClick={() => { 
                    setStep(1); // Go back to step 1
                    setPrediction(null); // Clear prediction if needed
                    setBetAmount(''); // Clear bet amount if needed
                }}> Back</button>
                <p>Set position</p>
                <button className='bg-button text-white px-4 py-2 rounded hover:bg-blue-600'>{prediction}</button>
            </div>
            <div className='card-content flex flex-col px-4 pt-4 pb-6 gap-6'>
                <label>
                    Enter Amount to Bet:
                </label>    
                <Input
                    type="number"
                    value={betAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                />
                <button onClick={() => {
                                if (isConnected) {
                                setStep(1); // Advance to step 3 if the wallet is already connected
                                } else {
                                handleConnect(); // Connect the wallet first
                                }
                                setIsPredictionConfirmed(true)
                            }}
                        className="connect-wallet-button bg-button text-white px-4 py-2 rounded hover:bg-blue-600">
                    {isConnected ? 'Confirm' : 'Connect Wallet'}
                </button>
            </div>  
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
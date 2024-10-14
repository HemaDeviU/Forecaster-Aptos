"use client";

import { useState, useEffect } from 'react';
import { Input } from './ui/input'
import { ArrowUp } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

const PredictionCard = ({ timer, secondTimer, isSecondTimerActive })  => {
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
    if (isPredictionConfirmed) {
      return 'UP';
    }
    return 'Enter UP';
  };

  const downButtonLabel = () => {
    if (timer === 0) {
      return 'DOWN';
    }
    if (isPredictionConfirmed) {
      return 'DOWN';
    }
    return 'Enter DOWN';
  };

  return (
    <div className="card h-[565px]">
      {/* Step 1: Render the card content based on the current step */}
      {step === 1 && (
        <div className="prediction-step bg-lighter overflow-hidden text-white h-full">
            <div className='card-header border-b-4 border-black h-[64px] bg-accent p-4 flex justify-between items-center'>
                <p> {isSecondTimerActive ? "LIVE" : secondTimer === 0 ? "EXPIRED" : "NEXT"} </p>
                    {/* Display entered prediction if confirmed */}
                    {isPredictionConfirmed && prediction && (
                    <p className='bg-lighter text-white px-4 py-2 rounded-xl'>Entered {prediction}</p>
                    )}
                    {secondTimer === 0 && !isPredictionConfirmed && (
                    <p className='bg-lighter text-white px-4 py-2 rounded-xl'>UP won</p>
                    )}
            </div>
            <div className='card-content flex flex-col px-4 pt-4 pb-8 gap-4 relative justify-between'>
                  

                {/* Conditional rendering of content based on timer state */}
                {timer > 0 ? (
                    <div>
                    {/* Content for when the timer is running */}
                        <div className='central-info border-accent bg-more-lighter rounded-2xl gap-4 p-4 flex flex-col justify-center items-center'>
                           <img src="images/3d treasure.png" alt="3d treasure prize pool" className='pool-img' />
                            <div className='card-header flex w-full justify-between items-center'>
                                <p>Prize Pool</p>
                                <p className='font-black text-md'>7.3 APT</p>
                            </div>  
                        </div>  
                    </div>
                ) : (
                    <div>
                    {/* Content for when the timer is over */}
                        <div className='central-info bg-more-lighter border-accent rounded-2xl p-4 flex flex-col gap-4 h-[260px] justify-between'>
                            <div className='mt-4'>
                                <p>Last Price</p>
                                <div className='flex justify-between items-center'>
                                    <p className='text-[24px] font-bold'>$64,685</p>
                                    <div className='flex bg-[#05DB62] rounded-xl p-2'><ArrowUp size={24} color="#fff" /> {/* Customize size and color */}<p>$172</p></div>
                                </div>
                            </div>
                            <div className='bg-[#6D6FEB] w-full h-[2px]'/>
                            <div className='mb-4'>
                                <div className='card-header flex justify-between mb-2'>
                                    <p>Locked Price</p>
                                    <p className='font-black text-md' >$64,513</p>
                                </div> 
                                <div className='card-header flex justify-between'>
                                    <p>Prize Pool</p>
                                    <p className='font-black text-md'>8.3 APT</p>
                                </div> 
                            </div>  
                        </div> 
                    </div>
                )}

                <div className='prediction-buttons px-8'>
                    <button onClick={() => handlePrediction('UP')} className='up-button w-full relative mb-2'>
                        <svg width="100%" height="auto" viewBox="0 0 194 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-outside-1_133_2730" maskUnits="userSpaceOnUse" x="0" y="0" width="194" height="78" fill="black">
                            <rect fill="white" width="194" height="78"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2445 36.8689C6.6475 39.1945 3 44.6598 3 50.7208V56.7208V57.2567V63.2567C3 69.4699 8.0368 74.5067 14.25 74.5067H179.25C185.463 74.5067 190.5 69.4699 190.5 63.2567V57.2567V56.7208V50.7208C190.5 44.6598 186.852 39.1945 181.255 36.8689L102.505 4.14812C98.8212 2.61729 94.6788 2.61729 90.9945 4.14813L12.2445 36.8689Z"/>
                            </mask>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2445 36.8689C6.6475 39.1945 3 44.6598 3 50.7208V56.7208V57.2567V63.2567C3 69.4699 8.0368 74.5067 14.25 74.5067H179.25C185.463 74.5067 190.5 69.4699 190.5 63.2567V57.2567V56.7208V50.7208C190.5 44.6598 186.852 39.1945 181.255 36.8689L102.505 4.14812C98.8212 2.61729 94.6788 2.61729 90.9945 4.14813L12.2445 36.8689Z" fill="#05DB62"/>
                            <path d="M12.2445 36.8689L11.0934 34.0985L11.0934 34.0985L12.2445 36.8689ZM181.255 36.8689L182.407 34.0985L182.407 34.0985L181.255 36.8689ZM102.505 4.14812L101.354 6.9185L101.354 6.9185L102.505 4.14812ZM90.9945 4.14813L92.1456 6.9185L92.1456 6.9185L90.9945 4.14813ZM6 50.7208C6 45.872 8.918 41.4997 13.3956 39.6393L11.0934 34.0985C4.377 36.8892 0 43.4477 0 50.7208H6ZM6 56.7208V50.7208H0V56.7208H6ZM6 57.2567V56.7208H0V57.2567H6ZM6 63.2567V57.2567H0V63.2567H6ZM14.25 71.5067C9.69365 71.5067 6 67.8131 6 63.2567H0C0 71.1268 6.37994 77.5067 14.25 77.5067V71.5067ZM179.25 71.5067H14.25V77.5067H179.25V71.5067ZM187.5 63.2567C187.5 67.8131 183.806 71.5067 179.25 71.5067V77.5067C187.12 77.5067 193.5 71.1268 193.5 63.2567H187.5ZM187.5 57.2567V63.2567H193.5V57.2567H187.5ZM187.5 56.7208V57.2567H193.5V56.7208H187.5ZM187.5 50.7208V56.7208H193.5V50.7208H187.5ZM180.104 39.6393C184.582 41.4997 187.5 45.872 187.5 50.7208H193.5C193.5 43.4477 189.123 36.8892 182.407 34.0985L180.104 39.6393ZM101.354 6.9185L180.104 39.6393L182.407 34.0985L103.657 1.37775L101.354 6.9185ZM92.1456 6.9185C95.093 5.69383 98.4069 5.69383 101.354 6.9185L103.657 1.37775C99.2354 -0.459251 94.2646 -0.459249 89.8434 1.37775L92.1456 6.9185ZM13.3956 39.6393L92.1456 6.9185L89.8434 1.37775L11.0934 34.0985L13.3956 39.6393Z" fill="#F1F2FF" mask="url(#path-1-outside-1_133_2730)"/>
                            <path d="M3 56.7208C3 50.6598 6.6475 45.1945 12.2445 42.8689L90.9945 10.1481C94.6788 8.61729 98.8212 8.61729 102.505 10.1481L181.255 42.8689C186.852 45.1945 190.5 50.6598 190.5 56.7208V63.2567C190.5 69.4699 185.463 74.5067 179.25 74.5067H14.25C8.0368 74.5067 3 69.4699 3 63.2567V56.7208Z" fill="#008653"/>
                            <path d="M3 50.7208C3 44.6598 6.6475 39.1945 12.2445 36.8689L90.9945 4.14813C94.6788 2.61729 98.8212 2.61729 102.505 4.14812L181.255 36.8689C186.852 39.1945 190.5 44.6598 190.5 50.7208V57.2567C190.5 63.4699 185.463 68.5067 179.25 68.5067H14.25C8.0368 68.5067 3 63.4699 3 57.2567V50.7208Z" fill="#05DB62"/>
                        </svg> 
                        <div className='w-full flex flex-col justify-center items-center absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                            <p className='pred-button-title font-black'>{upButtonLabel()}</p>
                            <p className='payout mt-[-4px]'>Payout 1.5X</p>
                        </div>
                    </button> 

                    <button onClick={() => handlePrediction('DOWN')} className='down-button w-full relative'>
                         <svg width="100%" height="auto" viewBox="0 0 194 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-outside-1_133_2797" maskUnits="userSpaceOnUse" x="-2.62268e-07" y="-1.66978e-05" width="194" height="78" fill="black">
                            <rect fill="white" x="-2.62268e-07" y="-1.66978e-05" width="194" height="78"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M181.755 41.1311C187.353 38.8055 191 33.3402 191 27.2792L191 21.2792L191 20.7433L191 14.7433C191 8.53009 185.963 3.49329 179.75 3.49329L14.75 3.49327C8.53681 3.49327 3.50001 8.53007 3.50001 14.7433L3.5 20.7433L3.5 21.2792L3.5 27.2792C3.5 33.3401 7.14751 38.8055 12.7445 41.1311L91.4945 73.8519C95.1788 75.3827 99.3212 75.3827 103.005 73.8519L181.755 41.1311Z"/>
                            </mask>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M181.755 41.1311C187.353 38.8055 191 33.3402 191 27.2792L191 21.2792L191 20.7433L191 14.7433C191 8.53009 185.963 3.49329 179.75 3.49329L14.75 3.49327C8.53681 3.49327 3.50001 8.53007 3.50001 14.7433L3.5 20.7433L3.5 21.2792L3.5 27.2792C3.5 33.3401 7.14751 38.8055 12.7445 41.1311L91.4945 73.8519C95.1788 75.3827 99.3212 75.3827 103.005 73.8519L181.755 41.1311Z" fill="#EF4D9B"/>
                            <path d="M181.755 41.1311L182.907 43.9015L182.907 43.9015L181.755 41.1311ZM191 20.7433L194 20.7433L191 20.7433ZM191 14.7433L188 14.7433L191 14.7433ZM3.50001 14.7433L6.50001 14.7433L3.50001 14.7433ZM3.5 20.7433L0.500005 20.7433L3.5 20.7433ZM3.5 21.2792L6.5 21.2792L3.5 21.2792ZM3.5 27.2792L0.500004 27.2792L3.5 27.2792ZM12.7445 41.1311L11.5934 43.9015L11.5934 43.9015L12.7445 41.1311ZM91.4945 73.8519L92.6456 71.0815L92.6456 71.0815L91.4945 73.8519ZM103.005 73.8519L101.854 71.0815L101.854 71.0815L103.005 73.8519ZM188 27.2792C188 32.128 185.082 36.5003 180.604 38.3607L182.907 43.9015C189.623 41.1108 194 34.5523 194 27.2792L188 27.2792ZM188 21.2792L188 27.2792L194 27.2792L194 21.2792L188 21.2792ZM188 20.7433L188 21.2792L194 21.2792L194 20.7433L188 20.7433ZM188 14.7433L188 20.7433L194 20.7433L194 14.7433L188 14.7433ZM179.75 6.49329C184.306 6.49329 188 10.1869 188 14.7433L194 14.7433C194 6.87324 187.62 0.493286 179.75 0.493285L179.75 6.49329ZM14.75 6.49327L179.75 6.49329L179.75 0.493285L14.75 0.493271L14.75 6.49327ZM6.50001 14.7433C6.50001 10.1869 10.1937 6.49327 14.75 6.49327L14.75 0.493271C6.87996 0.49327 0.500006 6.87322 0.500005 14.7433L6.50001 14.7433ZM6.5 20.7433L6.50001 14.7433L0.500005 14.7433L0.500005 20.7433L6.5 20.7433ZM6.5 21.2792L6.5 20.7433L0.500005 20.7433L0.500005 21.2792L6.5 21.2792ZM6.5 27.2792L6.5 21.2792L0.500005 21.2792L0.500004 27.2792L6.5 27.2792ZM13.8956 38.3607C9.41801 36.5003 6.5 32.128 6.5 27.2792L0.500004 27.2792C0.500004 34.5523 4.87701 41.1108 11.5934 43.9015L13.8956 38.3607ZM92.6456 71.0815L13.8956 38.3607L11.5934 43.9015L90.3434 76.6222L92.6456 71.0815ZM101.854 71.0815C98.907 72.3062 95.5931 72.3062 92.6456 71.0815L90.3434 76.6222C94.7646 78.4592 99.7354 78.4592 104.157 76.6222L101.854 71.0815ZM180.604 38.3607L101.854 71.0815L104.157 76.6222L182.907 43.9015L180.604 38.3607Z" fill="#F1F2FF" mask="url(#path-1-outside-1_133_2797)"/>
                            <path d="M191 27.2792C191 33.3402 187.353 38.8055 181.755 41.1311L103.005 73.8519C99.3212 75.3827 95.1788 75.3827 91.4945 73.8519L12.7445 41.1311C7.14751 38.8055 3.5 33.3401 3.5 27.2792L3.5 20.7433C3.50001 14.5301 8.5368 9.49327 14.75 9.49327L179.75 9.49329C185.963 9.49329 191 14.5301 191 20.7433L191 27.2792Z" fill="#BD005B"/>
                            <path d="M191 21.2792C191 27.3402 187.353 32.8055 181.755 35.1311L103.005 67.8519C99.3212 69.3827 95.1788 69.3827 91.4945 67.8519L12.7445 35.1311C7.14751 32.8055 3.5 27.3401 3.5 21.2792L3.5 14.7433C3.50001 8.53007 8.5368 3.49327 14.75 3.49327L179.75 3.49329C185.963 3.49329 191 8.53009 191 14.7433L191 21.2792Z" fill="#EF4D9B"/>
                        </svg>
                        <div className='w-full flex flex-col justify-center items-center absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                            <p className='pred-button-title font-black w-full'>{downButtonLabel()}</p>
                            <p className='payout mt-[-4px]'>Payout 1.5X</p>
                        </div>
                    </button>
                </div>
                


                {secondTimer === 0 && isPredictionConfirmed && (
                    <div className='absolute top-0 left-0 w-full h-full bg-lighter flex items-center justify-center'>
                        <p>
                        {hasWon === null 
                            ? "Waiting for result..." 
                            : hasWon 
                            ? "You have won!" 
                            : "You have lost."}
                        </p>
                        <p>8.3 APT</p>
                    </div>
                )}

            </div>
        </div>
      )}

      {step === 2 && (
        <div className="bet-step bg-lighter rounded-2xl overflow-hidden text-white h-full">
            <div className='card-header border-b-4 border-black h-[64px] bg-accent p-4 flex justify-between items-center'>
                <div className='flex justify-between items-center gap-2'>
                    <button onClick={() => { 
                        setStep(1); // Go back to step 1
                        setPrediction(null); // Clear prediction if needed
                        setBetAmount(''); // Clear bet amount if needed
                    }}> <ArrowLeft size={24} color="#fff" /> </button>
                    <p>Set position</p>
                </div>
                <button className='bg-lighter text-white px-4 py-2 rounded-xl'>{prediction}</button>
            </div>
            <div className='card-content h-[495px] flex flex-col px-4 pt-4 pb-6 gap-6 justify-between'>
                <div>
                    {/* Content for when the timer is running */}
                        <div className='central-info border-accent bg-more-lighter rounded-2xl gap-4 p-4 flex flex-col justify-center items-center'>
                           <img src="images/3d treasure.png" alt="3d treasure prize pool" className='pool-img' />
                            <div className='card-header flex w-full justify-between items-center'>
                                <p>Prize Pool</p>
                                <p className='font-black text-md'>8.3 APT</p>
                            </div>  
                        </div>  
                </div>
                <div>
                    <div>
                        <div className='flex justify-between items-center w-full mb-2'>
                            <label>
                                Commit:
                            </label> 
                            <div className='flex items-center gap-2'> <img src="images/aptos logo.png" alt="aptos logo" className='aptos-img' /> <p>APT</p></div>
                        </div>
                        <Input
                            type="number"
                            value={betAmount}
                            onChange={handleAmountChange}
                            placeholder="0.0"
                            className="placeholder:text-gray-400 rounded-xl"
                        />
                    </div>           
                    <button onClick={() => {
                                    if (isConnected) {
                                    setStep(1); // Advance to step 3 if the wallet is already connected
                                    } else {
                                    handleConnect(); // Connect the wallet first
                                    }
                                    setIsPredictionConfirmed(true)
                                }}
                            className="connect-wallet-button connect-button-hover bg-button text-white px-4 py-2 rounded mt-4 w-full rounded-xl">
                        {isConnected ? 'Confirm' : 'Connect Wallet'}
                    </button>
                </div>
                
            </div>  
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
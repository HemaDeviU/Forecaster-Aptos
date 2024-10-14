import Link from 'next/link';
import { Button } from './ui/button';


const Card = () => {
  return (
    <div className="prediction-step bg-lighter rounded-2xl overflow-hidden text-white">
      <div className='card-header bg-accent p-4 flex justify-between'>
        <p>Next</p>
        <p>03:42</p>
      </div>
      <div className='card-content flex flex-col px-4 pt-4 pb-6 gap-6'>
          <button className='up-button w-full relative mb-2 '>
              <svg width="100%" height="auto" viewBox="0 0 250 88" fill="none" style={{ filter: "drop-shadow(0px 10px 0px #1B5887)" }}  xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 64.2854C0 56.2042 4.86333 48.917 12.326 45.8163L117.326 2.18855C122.238 0.147439 127.762 0.14744 132.674 2.18855L237.674 45.8163C245.137 48.917 250 56.2042 250 64.2854V73C250 81.2843 243.284 88 235 88H15C6.71573 88 0 81.2843 0 73V64.2854Z" fill="#1FD690"/>
              </svg> 
              <div className='flex flex-col justify-center items-center absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  <p>Enter UP</p>
                  <p>Payout 1.5X</p>
              </div>
          </button>   
        <div className='central-info border-accent rounded-2xl'>
            <div className='card-header p-4 flex justify-between'>
                <p>Prize Pool</p>
                <p>42.3 APT</p>
            </div>  
        </div>
        <button className='down-button relative'>
             <svg width="100%" height="auto" viewBox="0 0 250 88" fill="none" style={{ filter: "drop-shadow(0px 10px 0px #542784)" }} xmlns="http://www.w3.org/2000/svg">
               <path d="M250 23.7146C250 31.7958 245.137 39.083 237.674 42.1838L132.674 85.8114C127.762 87.8525 122.238 87.8525 117.326 85.8114L12.326 42.1837C4.86331 39.083 -2.48014e-05 31.7958 -2.40949e-05 23.7146L-2.3333e-05 15C-2.26088e-05 6.71573 6.71571 6.6592e-07 15 1.39015e-06L235 2.06232e-05C243.284 2.13474e-05 250 6.71575 250 15L250 23.7146Z" fill="#EF4D9B"/>
             </svg>
            <div className='flex flex-col justify-center items-center absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <p>Enter UP</p>
                <p>Payout 1.5X</p>
            </div>
        </button>
      </div>
    </div>
  );
};

export default Card;
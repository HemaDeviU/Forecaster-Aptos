import Link from 'next/link';
import { Home, Search, Bell, User } from 'lucide-react';

const BottomMenu = () => {
  return (
    <nav className='relative p-8 pt-3 pb-0'>
        <svg width="398" height="130" viewBox="0 0 394 130" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute top-0 left-0 -ml-1'>
            <path d="M1 128V129H2H392H393V128V34.2919C393 24.7419 385.258 17 375.708 17H310.561C301.112 17 291.864 14.2779 283.921 9.15943C275.655 3.83276 266.03 1 256.197 1H137.803C127.97 1 118.344 3.83276 110.079 9.15943C102.136 14.2779 92.8875 17 83.4386 17H18.2919C8.74185 17 1 24.7418 1 34.2919V128Z" fill="#4722BF" fill-opacity="0.4" stroke="#1F2295" stroke-width="2"/>
        </svg> 

        <div className="container mx-auto flex justify-between items-center px-4 rounded-full z-10 relative">
            <Link href="/chart" className="menu-icon-box flex flex-col items-center gap-1 w-[50px]">
                <div className='bg-[#4722BF] rounded-full w-[54px] h-[54px] flex justify-center items-center'>
                     <img src="images/Chart.png" alt="Predict Menu Icon" width="28px"/>
                </div>
                <span className="text-sm text-gray-100">Chart</span>
            </Link>
            <Link href="/" className="menu-icon-box flex flex-col items-center w-[50px] pb-4 gap-2">
                <div className='bg-accent rounded-full w-[64px] h-[64px] flex justify-center items-center'>
                      <img src="images/PredictIcon.png" alt="Predict Menu Icon" width="32px" />
                </div>
                <span className="text-sm text-gray-100">Predict</span>
            </Link>
            <Link href="/leaderboard" className="menu-icon-box flex flex-col items-center gap-1 w-[50px]">
                <div className='bg-[#4722BF] rounded-full w-[54px] h-[54px] flex justify-center items-center'>
                     <img src="images/Leaderboard.png" alt="Predict Menu Icon" width="28px" />
                </div>
                <span className="text-sm text-gray-100">Leaderboard</span>
            </Link>
        
        </div>
    </nav>
  );
};

export default BottomMenu;
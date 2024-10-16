"use client";

import WalletButton from '../components/walletButton'; // Adjust the path based on your folder structure
import Link from 'next/link';

const Navbar = () => {

 

  return (
    <nav className="px-4 py-2 border-b-2" style={{ borderColor: '#1F2295' }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <Link href="/">Forecaster</Link>
        </div>

        {/* Connect Button */}
        <div>
          {/* <button onClick={() => {
                                    handleConnect(); // Connect the wallet first
                                }}className="connect-button-hover rounded-full border-4 bg-button text-white px-4 py-1.5 rounded text-lg" style={{ borderColor: '#4D147C' }}
          >
            {isConnected ? 'Connected' : 'Connect'}
          </button> */}
          <WalletButton/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

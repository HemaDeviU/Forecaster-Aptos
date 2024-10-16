import React, { useState, useEffect, useRef } from 'react';

const WalletButton: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.martian) {
        const connected = await window.martian.isConnected();
        if (connected) {
          const accountInfo = await window.martian.account();
          setAccount(accountInfo.address);
        }
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.innerText = account ? 'Disconnect' : 'Connect';
    }
  }, [account]);

  const connectMartian = async () => {
    if (window.martian) {
      try {
        const response = await window.martian.connect();
        setAccount(response.address);
        console.log("Connected account:", response);
        setShowPopup(false); // Close the popup if connection is successful
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    } else {
      console.error("Martian wallet not found. Please install it.");
      setShowPopup(true); // Show popup if Martian wallet is not found
    }
  };

  const disconnectMartian = async () => {
    if (window.martian) {
      await window.martian.disconnect();
      setAccount(null);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {account ? (
        <div>
          <button 
            onClick={disconnectMartian} 
            className='connect-button-hover rounded-full border-4 bg-button text-white px-4 py-1.5 rounded text-lg' 
            style={{ borderColor: '#4D147C' }}>
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          ref={buttonRef} 
          onClick={connectMartian} 
          className='connect-button-hover rounded-full border-4 bg-button text-white px-4 py-1.5 rounded text-lg' 
          style={{ borderColor: '#4D147C' }}>
          Connect
        </button>
      )}

      {/* Popup for installing Martian Wallet */}
      {showPopup && (
        <div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full p-6 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full w-[400px]" 
          onClick={closePopup}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col rounded-xl">
            <h2 className="text-xl font-bold mb-2">Install Martian Wallet</h2>
            <p>Please install the Martian Wallet to continue.</p>
            <a href="https://chromewebstore.google.com/detail/martian-aptos-sui-wallet/efbglgofoippbgcjepnhiblaibcnclgk" className='mt-4 text-blue-700 underline'> Install</a>
            <button 
              className="mt-4 bg-button text-white px-4 py-2 rounded-xl" 
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
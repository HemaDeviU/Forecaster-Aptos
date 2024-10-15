"use client"; // Use client directive for client-side rendering

import { useState } from 'react';

// Sample leaderboard data (you can replace this with your actual data fetching logic)
const sampleData = {
  allTime: [
    { position: 1, profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'Bob Johnson', points: 852.4 },
    { position: 2, profilePicture: '/images/nft1.avif', name: 'Jonas.eth', points: 743.2 },
    { position: 3, profilePicture: '/images/nft4.webp', name: 'Charlie43', points: 615.9 },
    { position: 4, profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg', name: 'Diana Prince', points: 482.7 },
    { position: 5, profilePicture: 'https://randomuser.me/api/portraits/men/65.jpg', name: 'Ethan Hunt', points: 299.3 },
    { position: 6, profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg', name: 'sparrow', points: 230.8 },
    { position: 7, profilePicture: 'https://randomuser.me/api/portraits/women/13.jpg', name: 'IAmHannah', points: 178.5 },
    { position: 8, profilePicture: '/images/nft2.webp', name: 'zuky.eth', points: 150.1 },
  ],
  month: [
    { position: 1, profilePicture: '/images/nft3.avif', name: 'sparrow', points: 40.2 },
    { position: 2, profilePicture: 'https://randomuser.me/api/portraits/men/24.jpg', name: 'Mouheb2', points: 34.8 },
    { position: 3, profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'Bob Johnson', points: 33.0 },
  ],
  week: [
    { position: 1, profilePicture: '/images/nft3.avif', name: 'sparrow', points: 12.3 },
    { position: 2, profilePicture: 'https://randomuser.me/api/portraits/men/65.jpg', name: 'Ethan Hunt', points: 9.2 },
    { position: 3, profilePicture: 'https://randomuser.me/api/portraits/men/77.jpg', name: 'Ivan', points: 7.8 },
  ],
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'allTime' | 'month' | 'week'>('allTime');

  const handleTabChange = (tab: 'allTime' | 'month' | 'week') => {
    setActiveTab(tab);
  };

  const leaderboardData = sampleData[activeTab];

  return (
    <div className="container h-[621px] mx-auto p-4">
      {/* Tab Menu */}
      <div className="flex space-x-2 mb-4 text-white">
        <button
          onClick={() => handleTabChange('allTime')}
          className={`px-4 py-2 rounded-full border ${activeTab === 'allTime' ? 'bg-lighter border-0' : 'bg-transparent border-white'}`}
        >
          All Time
        </button>
        <button
          onClick={() => handleTabChange('month')}
          className={`px-4 py-2 rounded-full border ${activeTab === 'month' ? 'bg-lighter border-0' : 'bg-transparent border-white'}`}
        >
          Month
        </button>
        <button
          onClick={() => handleTabChange('week')}
          className={`px-4 py-2 rounded-full border ${activeTab === 'week' ? 'bg-lighter border-0' : 'bg-transparent border-white'}`}
        >
          Week
        </button>
      </div>

      {/* Leaderboard Table */}
      <table className="min-w-full border-collapse">
        <tbody className='flex flex-col gap-1'>
          {leaderboardData.map((account) => (
            <tr key={account.position} className='flex items-center text-white'>
              <td className="px-4 py-2 w-[20px]">{account.position}</td>
              <td className="px-4 py-2">
                <img
                  src={account.profilePicture}
                  alt={account.name}
                  className="w-12 rounded-full"
                />
              </td>
              <td className="py-2 w-full max-w-[130px]">{account.name}</td>
              <td className="px-4 py-2 flex justify-left items-center gap-2">
                <img src="images/Aptos Logo.png" alt="aptos logo" width="40px" />
                {account.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
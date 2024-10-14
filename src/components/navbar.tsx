import Link from 'next/link';
import { Button } from './ui/button';

const Navbar = () => {
  return (
    <nav className="px-4 py-2 border-b-2" style={{ borderColor: '#1F2295' }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <Link href="/">BetAPT</Link>
        </div>

        {/* Connect Button */}
        <div>
          <button className="connect-button-hover rounded-full border-4 bg-button text-white px-4 py-2 rounded text-lg" style={{ borderColor: '#4D147C' }}
          >
            CONNECT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
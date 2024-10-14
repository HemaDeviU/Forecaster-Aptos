import Link from 'next/link';
import { Button } from './ui/button';

const Navbar = () => {
  return (
    <nav className="p-4 bg-lighter">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <Link href="/">MyApp</Link>
        </div>

        {/* Connect Button */}
        <div>
          <button className="bg-button text-white px-4 py-2 rounded hover:bg-blue-600">
            Connect
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
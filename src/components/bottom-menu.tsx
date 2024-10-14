
import { Home, Search, Bell, User } from 'lucide-react';

const BottomMenu = () => {
  return (
    <nav className="p-4">
        <div className="container mx-auto flex justify-between items-center bg-menu py-4 px-8 rounded-full">
            <div className="flex flex-col items-center gap-2">
                <Home className="text-gray-100" />
                {/* <span className="text-sm text-gray-100">Home</span> */}
            </div>
            <div className="flex flex-col items-center gap-2">
                <Search className="text-gray-100" />
                {/* <span className="text-sm text-gray-100">Search</span> */}
            </div>
            <div className="flex flex-col items-center gap-2">
                <Bell className="text-gray-100" />
                {/* <span className="text-sm text-gray-100">Notifications</span> */}
            </div>
            <div className="flex flex-col items-center gap-2">
                <User className="text-gray-100" />
                {/* <span className="text-sm text-gray-100">Profile</span> */}
            </div>
        </div>
    </nav>
  );
};

export default BottomMenu;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Header = ({ isAdmin = false, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const userStatus = localStorage.getItem('userStatus');
    localStorage.clear();
    
    // Redirect based on user status
    if (userStatus === 'system_admin') {
      navigate('/master');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 ml-3">
          {isAdmin ? 'Admin Dashboard' : 'Doctor Dashboard'}
        </h1>
      </div>

      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
          <UserCircleIcon className="h-8 w-8" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl border border-gray-100">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? 'bg-gray-50 text-red-600' : 'text-gray-700'
                } group flex w-full items-center px-4 py-2 text-sm`}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </header>
  );
};

export default Header;
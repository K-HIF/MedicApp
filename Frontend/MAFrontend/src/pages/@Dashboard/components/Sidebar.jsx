import { Link, useLocation } from 'react-router-dom';
import {
  UsersIcon,
  UserGroupIcon,
  ChartPieIcon,
  ListBulletIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const Sidebar = ({ isAdmin = false, isOpen, onClose }) => {
  const location = useLocation();
  const basePath = isAdmin ? '/admin' : '/dashboard';

  const commonLinks = [
    {
      name: 'Overview',
      icon: ChartPieIcon,
      path: '',
    },
    {
      name: 'Patients',
      icon: UsersIcon,
      path: '/patients',
    },
    {
      name: 'Health Programs',
      icon: ListBulletIcon,
      path: '/categories',
    },
  ];

  const adminLinks = [
    {
      name: 'Doctors',
      icon: UserGroupIcon,
      path: '/doctors',
    }
  ];

  const navigationLinks = isAdmin ? [...commonLinks, ...adminLinks] : commonLinks;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between h-16 border-b px-6">
        <div className="flex items-center">
          <img src="/logo4.png" alt="MedicApp Logo" className="h-8 w-auto" />
          
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === `${basePath}${link.path}`;
            return (
              <li key={link.name}>
                <Link
                  to={`${basePath}${link.path}`}
                  onClick={() => onClose()}
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-white h-full border-r">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col w-full max-w-xs bg-white">
                {sidebarContent}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Sidebar;
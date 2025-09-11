import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Context/SidebarContext';
import { 
  Home, 
  User, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  UserCheck,
  Shield,
  Bell,
  FileText,
  Calendar,
  BarChart3,
  GraduationCap,
  BellIcon,
  BookCheck,
  FileArchive,
  SpeakerIcon,
  LucideMonitorSpeaker,
  Megaphone,
  UsersRoundIcon,
  Upload,
  Library
} from 'lucide-react';
import { FaMicrophone, FaSpeakerDeck } from 'react-icons/fa';

const Sidebar = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide sidebar on login and forgot-pin pages
  const shouldHideSidebar = location.pathname === '/' || 
                           location.pathname === '/login' || 
                           location.pathname === '/forgot-pin';

  const loadUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User data loaded:', parsedUser); // Debug log
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Load user data initially
    loadUserData();

    // Listen for storage changes (when localStorage is updated)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUserData();
      }
    };

    // Listen for custom events (we'll dispatch this from login)
    const handleUserUpdate = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataUpdated', handleUserUpdate);

    // Also check for user data changes on location change
    loadUserData();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserUpdate);
    };
  }, [location.pathname]); // Re-run when route changes

  if (shouldHideSidebar || !user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // Clear user state immediately
    navigate('/login');
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: 'Dashboard',
        path: `/${user.role}/dashboard`,
        active: location.pathname.includes('dashboard')
      }
    ];

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          {
            icon: User,
            label: 'Profile',
            path: '/student/profile',
            active: location.pathname === '/student/profile'
          },
          {
            icon: UsersRoundIcon,
            label: 'Lecturers',
            path: '/student/lecturers',
            active: location.pathname === '/student/lecturers'
          },
           {
            icon: Upload,
            label: 'Submissions',
            path: '/student/submissions',
            active: location.pathname === '/student/submissions'
          },
           {
            icon: BellIcon,
            label: 'Notifications',
            path: '/student/notifications',
            active: location.pathname === '/student/notifications'
          },
             {
            icon: Megaphone,
            label: 'Announcements',
            path: '/student/announcements',
            active: location.pathname === '/student/announcements'
          },
           {
            icon: Library,
            label: 'Student Thesis',
            path: '/student/thesis',
            active: location.pathname === '/student/thesis'
          },
          {
            icon: BarChart3,
            label: 'Grades',
            path: '/student/grades',
            active: location.pathname === '/student/grades'
          }
        ];

      case 'lecturer':
        return [
          ...baseItems,
          {
            icon: Users,
            label: 'Students',
            path: '/lecturer/students',
            active: location.pathname === '/lecturer/students'
          },
          {
            icon: UserCheck,
            label: 'Students Approval',
            path: '/lecturer/students/approval',
            active: location.pathname === '/lecturer/students/approval'
          },
           {
            icon: BookCheck,
            label: 'Lecturer Submissions',
            path: '/lecturer/submissions',
            active: location.pathname === '/lecturer/submissions'
          },
          {
            icon: Library,
            label: 'Lecturer Thesis',
            path: '/lecturer/thesis',
            active: location.pathname === '/lecturer/thesis'
          },
           {
            icon: BarChart3,
            label: 'Grades',
            path: '/lecturer/grades',
            active: location.pathname === '/lecturer/grades'
          },
          {
            icon: BellIcon,
            label: 'Notifications',
            path: '/lecturer/notifications',
            active: location.pathname === '/lecturer/notifications'
          },
            {
            icon: Megaphone,
            label: 'Announcements',
            path: '/lecturer/announcements',
            active: location.pathname === '/lecturer/announcements'
          },
          
          {
            icon: User,
            label: 'Profile',
            path: '/lecturer/profile',
            active: location.pathname === '/lecturer/profile'
          }
        ];

      case 'admin':
        return [
          ...baseItems,
          {
            icon: Users,
            label: 'Manage Users',
            path: '/admin/manage-users',
            active: location.pathname === '/admin/manage-users'
          },
         
          {
            icon: BookOpen,
            label: 'Assignments',
            path: '/admin/assignments',
            active: location.pathname === '/admin/assignments'
          },
         
         
          {
            icon: User,
            label: 'Profile',
            path: '/admin/profile',
            active: location.pathname === '/admin/profile'
          }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          bg-slate-800 text-white h-screen flex flex-col transition-all duration-300 
          fixed left-0 top-0 z-30 shadow-lg
          ${isExpanded ? 'w-64' : 'w-16'}
          ${isExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header with toggle */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between min-h-[72px]">
          {isExpanded && (
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} />
              </div>
              <span className="font-bold text-lg whitespace-nowrap">TMSPortal</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* User Welcome Section */}
        <div className={`${isExpanded ? 'block' : 'hidden'} p-4 border-b border-slate-700`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                Welcome back!
              </p>
              <p className="text-sm text-slate-300 truncate">
                {user.fullName || (user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : 'User')}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index} className="w-full">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg 
                    transition-all duration-200 group relative
                    ${item.active
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isExpanded ? (
                    <span className="font-medium truncate text-left flex-1">
                      {item.label}
                    </span>
                  ) : (
                    <div className="
                      absolute left-full ml-2 bg-slate-900 text-white px-3 py-2 
                      rounded-md text-sm opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 whitespace-nowrap z-50
                      pointer-events-none
                      before:absolute before:left-0 before:top-1/2 before:transform 
                      before:-translate-y-1/2 before:-translate-x-1 
                      before:border-4 before:border-transparent 
                      before:border-r-slate-900
                    ">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section - Notifications & Logout */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <div className="space-y-1">
            {/* Notifications */}
            <button className="
              w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg 
              text-slate-300 hover:bg-slate-700 hover:text-white 
              transition-all duration-200 group relative
            ">
              <Bell size={20} className="flex-shrink-0" />
              {isExpanded ? (
                <span className="font-medium text-left flex-1">Notifications</span>
              ) : (
                <div className="
                  absolute left-full ml-2 bg-slate-900 text-white px-3 py-2 
                  rounded-md text-sm opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 whitespace-nowrap z-50
                  pointer-events-none
                  before:absolute before:left-0 before:top-1/2 before:transform 
                  before:-translate-y-1/2 before:-translate-x-1 
                  before:border-4 before:border-transparent 
                  before:border-r-slate-900
                ">
                  Notifications
                </div>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg 
                text-red-300 hover:bg-red-600 hover:text-white 
                transition-all duration-200 group relative
              "
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isExpanded ? (
                <span className="font-medium text-left flex-1">Logout</span>
              ) : (
                <div className="
                  absolute left-full ml-2 bg-red-600 text-white px-3 py-2 
                  rounded-md text-sm opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 whitespace-nowrap z-50
                  pointer-events-none
                  before:absolute before:left-0 before:top-1/2 before:transform 
                  before:-translate-y-1/2 before:-translate-x-1 
                  before:border-4 before:border-transparent 
                  before:border-r-red-600
                ">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
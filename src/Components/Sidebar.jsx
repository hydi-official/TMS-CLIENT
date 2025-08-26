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
            icon: GraduationCap,
            label: 'Institutions',
            path: '/admin/institutions',
            active: location.pathname === '/admin/institutions'
          },
          {
            icon: BookOpen,
            label: 'Courses',
            path: '/admin/courses',
            active: location.pathname === '/admin/courses'
          },
          {
            icon: BarChart3,
            label: 'Reports',
            path: '/admin/reports',
            active: location.pathname === '/admin/reports'
          },
          {
            icon: Settings,
            label: 'Settings',
            path: '/admin/settings',
            active: location.pathname === '/admin/settings'
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
    <div 
      className={`bg-slate-800 text-white h-screen flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      } fixed left-0 top-0 z-30 shadow-lg`}
    >
      {/* Header with toggle */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {isExpanded && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <span className="font-bold text-lg">TMSPortal</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* User Welcome Section */}
      {isExpanded && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
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
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  item.active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isExpanded && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
                {!isExpanded && (
                  <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section - Notifications & Logout */}
      <div className="p-4 border-t border-slate-700">
        <div className="space-y-2">
          {/* Notifications */}
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors group">
            <Bell size={20} className="flex-shrink-0" />
            {isExpanded && <span className="font-medium">Notifications</span>}
            {!isExpanded && (
              <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Notifications
              </div>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-600 hover:text-white transition-colors group"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isExpanded && <span className="font-medium">Logout</span>}
            {!isExpanded && (
              <div className="absolute left-16 bg-red-600 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
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
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide sidebar on login and forgot-pin pages
  const shouldHideSidebar = location.pathname === '/' || 
                           location.pathname === '/login' || 
                           location.pathname === '/forgot-pin';

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  if (shouldHideSidebar || !user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
            icon: BookOpen,
            label: 'Lecturers',
            path: '/student/lecturers',
            active: location.pathname === '/student/lecturers'
          },
          {
            icon: Calendar,
            label: 'Schedule',
            path: '/student/schedule',
            active: location.pathname === '/student/schedule'
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
            icon: BookOpen,
            label: 'Courses',
            path: '/lecturer/courses',
            active: location.pathname === '/lecturer/courses'
          },
          {
            icon: FileText,
            label: 'Assignments',
            path: '/lecturer/assignments',
            active: location.pathname === '/lecturer/assignments'
          },
          {
            icon: BarChart3,
            label: 'Analytics',
            path: '/lecturer/analytics',
            active: location.pathname === '/lecturer/analytics'
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
            <span className="font-bold text-lg">EduPortal</span>
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
                {user.fullName || user.firstName + ' ' + user.lastName || 'User'}
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
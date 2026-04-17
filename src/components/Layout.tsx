import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { auth } from '../firebase';
import { signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { cn } from '../lib/utils';
import { 
  Menu, 
  User as UserIcon, 
  BarChart3, 
  BookOpen, 
  Terminal, 
  Star,
  LogOut,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNav, showBack }) => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      alert(`Error al iniciar sesión: ${error.message}`);
    }
  };

  const navItems = [
    { name: 'Analizar', path: '/analyze', icon: BarChart3 },
    { name: 'Biblioteca', path: '/library', icon: BookOpen },
    { name: 'Prompts', path: '/prompts', icon: Terminal },
    { name: 'Pro', path: '/plans', icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-[#f9f9f9] dark:bg-[#0a0a0a] border-b-4 border-[#1a1c1c] dark:border-[#f9f9f9] transition-colors duration-300">
        <div className="flex items-center gap-4">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="cursor-pointer dark:text-[#f9f9f9]">
              <ChevronLeft size={32} />
            </button>
          ) : (
            <Menu className="cursor-pointer dark:text-[#f9f9f9]" />
          )}
          <Link to="/" className="text-2xl font-black uppercase tracking-tighter text-[#1a1c1c] dark:text-[#f9f9f9]">
            ■ DIGERIA
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 mr-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[0.75rem] font-black uppercase tracking-widest transition-none",
                  location.pathname === item.path ? "text-[#b1241a]" : "text-[#1a1c1c] dark:text-[#f9f9f9]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button 
            onClick={toggleTheme}
            className="p-2 border-2 border-[#1a1c1c] dark:border-[#f9f9f9] hover:bg-[#dcdddd] dark:hover:bg-[#1a1c1c] transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-[#f9f9f9]" />}
          </button>
          
          {user ? (
            <Link to="/profile">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-[#1a1c1c] dark:border-[#f9f9f9]" />
              ) : (
                <UserIcon size={32} className="text-[#1a1c1c] dark:text-[#f9f9f9]" />
              )}
            </Link>
          ) : (
            <button onClick={handleLogin} className="text-[0.75rem] font-black uppercase tracking-widest text-[#b1241a]">
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-32 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* BottomNavBar (Mobile) */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-stretch h-16 bg-[#f9f9f9] dark:bg-[#0a0a0a] border-t-4 border-[#1a1c1c] dark:border-[#f9f9f9] md:hidden transition-colors duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center p-2 w-full h-full transition-none",
                  isActive ? "bg-[#b1241a] text-white" : "text-[#1a1c1c] dark:text-[#f9f9f9]"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                <span className="font-bold text-[10px] uppercase mt-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

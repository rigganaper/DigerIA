import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Layout } from '../components/Layout';
import { Sun, Moon, ChevronDown, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

const Profile = () => {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <Layout>
      <header className="mb-12">
        <h2 className="text-[3.5rem] font-black uppercase mb-2 dark:text-[#f9f9f9]">PROFILE</h2>
        <p className="text-[#5d5f5f] dark:text-[#dcdddd] font-bold uppercase tracking-widest text-xs">Account Authority / v1.0.4</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TU CUENTA Section */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-[#1a1c1c] border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-8">
          <h3 className="text-2xl font-black uppercase mb-8 border-b-2 border-[#1a1c1c] dark:border-[#f9f9f9] pb-2 inline-block self-start dark:text-[#f9f9f9]">TU CUENTA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase text-[#5d5f5f] dark:text-[#dcdddd] mb-2 tracking-tighter">IDENTIFIER</span>
              <span className="text-xl font-bold tracking-tight dark:text-[#f9f9f9]">{profile?.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase text-[#5d5f5f] dark:text-[#dcdddd] mb-2 tracking-tighter">TIER STATUS</span>
              <div className="flex items-center gap-2">
                <span className="bg-[#b1241a] text-white px-3 py-1 text-sm font-black uppercase">{profile?.tier.toUpperCase()}</span>
                <span className="text-[#1a1c1c]/40 dark:text-[#f9f9f9]/40 text-sm font-bold uppercase">{profile?.tier === 'free' ? '' : 'FREE'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PREFERENCIAS Section */}
        <div className="lg:col-span-4 flex flex-col bg-[#f3f3f4] dark:bg-[#1a1c1c] border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-8">
          <h3 className="text-2xl font-black uppercase mb-8 dark:text-[#f9f9f9]">PREFERENCIAS</h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-[#5d5f5f] dark:text-[#dcdddd] tracking-tighter">UI VISUAL MODE</label>
              <div className="flex border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
                <button 
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={cn(
                    "flex-1 py-4 flex items-center justify-center gap-2 font-black uppercase text-xs transition-none",
                    theme === 'light' ? "bg-[#1a1c1c] text-[#f9f9f9]" : "bg-transparent text-[#f9f9f9] hover:bg-[#121212]"
                  )}
                >
                  <Sun size={16} />
                  Light
                </button>
                <button 
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={cn(
                    "flex-1 py-4 flex items-center justify-center gap-2 font-black uppercase text-xs transition-none",
                    theme === 'dark' ? "bg-[#f9f9f9] text-[#1a1c1c]" : "bg-transparent text-[#1a1c1c] dark:text-[#f9f9f9] hover:bg-[#eeeeee] dark:hover:bg-[#121212]"
                  )}
                >
                  <Moon size={16} />
                  Dark
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-[#5d5f5f] dark:text-[#dcdddd] tracking-tighter">IDIOMA</label>
              <div className="border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 flex justify-between items-center bg-white dark:bg-[#121212] cursor-pointer hover:bg-[#f3f3f4] dark:hover:bg-[#1a1c1c] dark:text-[#f9f9f9]">
                <span className="font-bold uppercase text-sm">Español</span>
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-[#5d5f5f] dark:text-[#dcdddd] tracking-tighter">DATA LOCALIZATION</label>
              <div className="border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 flex justify-between items-center bg-white dark:bg-[#121212] dark:text-[#f9f9f9]">
                <span className="font-bold uppercase text-sm">EU-WEST-1</span>
                <Lock size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* SUSCRIPCIÓN Section */}
        <div className="lg:col-span-12 flex flex-col md:flex-row items-center justify-between bg-[#e2e2e2] dark:bg-[#1a1c1c] border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-8 gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-black uppercase leading-none dark:text-[#f9f9f9]">SUSCRIPCIÓN</h3>
            <p className="text-sm font-medium dark:text-[#dcdddd]">
              Plan {profile?.tier || 'Free'}. Próximo ciclo: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={() => navigate('/plans')}
            className="w-full md:w-auto px-12 py-4 bg-[#1a1c1c] dark:bg-[#333333] text-white dark:text-white font-black uppercase tracking-widest text-sm hover:bg-[#5d5f5f] dark:hover:bg-[#444444] transition-none border-2 border-transparent dark:border-[#f9f9f9]"
          >
            MANAGE
          </button>
        </div>

        {/* LOGOUT Action */}
        <div className="lg:col-span-12 mt-8 flex justify-start">
          <button 
            onClick={handleLogout}
            className="w-full md:w-64 py-6 bg-[#b1241a] text-white font-black uppercase tracking-[0.2em] text-lg ring-4 ring-[#1a1c1c] dark:ring-[#f9f9f9] hover:opacity-90 transition-none"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

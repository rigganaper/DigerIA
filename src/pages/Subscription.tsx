import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Lock, ShieldCheck, CreditCard, Smartphone, Shield, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Subscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);

    try {
      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Update user tier in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        tier: 'pro',
        maxCredits: 1000, // Pro tier benefit
        updatedAt: new Date().toISOString()
      });

      setIsSuccess(true);
      
      // Redirect after showing success state
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Error al procesar el pago. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout hideNav>
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-8 animate-bounce">
            <CheckCircle2 size={120} className="text-green-600" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 dark:text-[#f9f9f9]">
            PAGO COMPLETADO
          </h2>
          <p className="text-xl font-bold uppercase tracking-widest text-[#5d5f5f] dark:text-[#dcdddd]">
            TU CUENTA HA SIDO ELEVADA A NIVEL PRO
          </p>
          <div className="mt-12 w-64 h-1 bg-[#eeeeee] dark:bg-[#1a1c1c] overflow-hidden">
            <div className="h-full bg-green-600 animate-progress-pulse w-full"></div>
          </div>
          <p className="mt-4 text-xs font-black uppercase opacity-50 dark:text-[#f9f9f9]">REDIRECCIONANDO AL PANEL DE CONTROL...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBack hideNav>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div className="border-l-4 border-[#b1241a] pl-6">
            <h2 className="text-[3.5rem] font-black leading-[0.9] tracking-tighter uppercase mb-6 dark:text-[#f9f9f9]">CONFIRMAR SUSCRIPCIÓN</h2>
            <div className="bg-[#eeeeee] dark:bg-[#1a1c1c] p-6 border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
              <p className="font-bold text-xs uppercase tracking-widest text-[#5d5f5f] dark:text-[#dcdddd] mb-2">Producto Seleccionado</p>
              <h3 className="text-2xl font-black uppercase tracking-tight dark:text-[#f9f9f9]">PLAN PRO - €8.99/MES</h3>
              <div className="mt-4 pt-4 border-t-2 border-[#1a1c1c] dark:border-[#f9f9f9] flex justify-between items-center dark:text-[#f9f9f9]">
                <span className="font-bold uppercase text-xs">Total hoy</span>
                <span className="text-3xl font-black">€8.99</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-[#f3f3f4] dark:bg-[#1a1c1c] p-4 border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
              <Lock className="text-[#b1241a]" />
              <span className="font-bold text-xs uppercase dark:text-[#f9f9f9]">Encriptación SSL de 256 bits</span>
            </div>
            <div className="flex items-center gap-3 bg-[#f3f3f4] dark:bg-[#1a1c1c] p-4 border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
              <ShieldCheck className="text-[#b1241a]" />
              <span className="font-bold text-xs uppercase dark:text-[#f9f9f9]">Pago Seguro Garantizado</span>
            </div>
          </div>

          <div className="mt-auto hidden md:block">
            <img 
              alt="Security" 
              className="w-full h-48 object-cover border-2 border-[#1a1c1c] dark:border-[#f9f9f9] grayscale contrast-125" 
              src="https://picsum.photos/seed/security/800/400" 
            />
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#1a1c1c] border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-8 md:p-12">
          <form onSubmit={handlePay} className="space-y-8">
            <div className="space-y-2">
              <label className="block font-black text-xs uppercase tracking-tighter text-[#1a1c1c] dark:text-[#f9f9f9]">Nombre del titular</label>
              <input 
                required
                className="w-full bg-transparent border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 font-bold text-lg focus:ring-0 focus:border-[#b1241a] outline-none placeholder:text-[#e2e2e2] dark:text-[#f9f9f9]" 
                placeholder="JUAN PÉREZ" 
                type="text"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-black text-xs uppercase tracking-tighter text-[#1a1c1c] dark:text-[#f9f9f9]">Número de tarjeta</label>
              <div className="relative">
                <input 
                  required
                  className="w-full bg-transparent border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 font-bold text-lg focus:ring-0 focus:border-[#b1241a] outline-none placeholder:text-[#e2e2e2] dark:text-[#f9f9f9]" 
                  placeholder="0000 0000 0000 0000" 
                  type="text"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <CreditCard className="text-[#5d5f5f] dark:text-[#dcdddd] opacity-50" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-black text-xs uppercase tracking-tighter text-[#1a1c1c] dark:text-[#f9f9f9]">Caducidad</label>
                <input 
                  required
                  className="w-full bg-transparent border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 font-bold text-lg focus:ring-0 focus:border-[#b1241a] outline-none placeholder:text-[#e2e2e2] dark:text-[#f9f9f9]" 
                  placeholder="MM / YY" 
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-black text-xs uppercase tracking-tighter text-[#1a1c1c] dark:text-[#f9f9f9]">CVC</label>
                <input 
                  required
                  className="w-full bg-transparent border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 font-bold text-lg focus:ring-0 focus:border-[#b1241a] outline-none placeholder:text-[#e2e2e2] dark:text-[#f9f9f9]" 
                  placeholder="123" 
                  type="text"
                />
              </div>
            </div>

            <p className="text-[10px] uppercase font-bold text-[#5d5f5f] dark:text-[#dcdddd] leading-relaxed">
              Al confirmar la suscripción, autorizas a DIGERIA a realizar cargos mensuales automáticos. Puedes cancelar en cualquier momento desde tu panel de control técnico.
            </p>

            <button 
              type="submit"
              disabled={isProcessing}
              className={`w-full bg-[#b1241a] text-white py-6 text-2xl font-black uppercase tracking-tight transition-none border-b-8 border-[#1a1c1c] dark:border-[#f9f9f9] active:translate-y-1 active:border-b-4 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d43e30]'}`}
            >
              {isProcessing ? 'PROCESANDO...' : 'PAGAR AHORA'}
            </button>
          </form>

          <div className="mt-12 flex justify-between items-center pt-8 border-t-2 border-[#e8e8e8] dark:border-[#f9f9f9] grayscale opacity-60 dark:text-[#f9f9f9]">
            <div className="flex gap-4">
              <Smartphone size={32} />
              <Shield size={32} />
              <Key size={32} />
            </div>
            <div className="text-right">
              <p className="font-black text-[10px] uppercase">Seguridad Certificada</p>
              <p className="uppercase text-[10px]">PCI DSS Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;

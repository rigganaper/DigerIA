import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CheckCircle } from 'lucide-react';

const Plans = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="border-b-4 border-[#1a1c1c] dark:border-[#f9f9f9] pb-4 mb-12">
        <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none text-left uppercase dark:text-[#f9f9f9]">
          PLANES
        </h2>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-4 border-[#1a1c1c] dark:border-[#f9f9f9]">
        {/* FREE PLAN */}
        <section className="p-0 border-b-4 border-[#1a1c1c] dark:border-[#f9f9f9] md:border-r-4">
          <div className="p-6 bg-[#dcdddd] dark:bg-[#1a1c1c] border-b-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
            <h3 className="text-4xl font-black uppercase tracking-tighter dark:text-[#f9f9f9]">GRATUITO</h3>
            <p className="text-xl font-bold mt-2 uppercase opacity-60 dark:text-[#dcdddd]">0.00€/mes</p>
          </div>
          <div className="p-6 space-y-6">
            {[
              '2 análisis/día',
              'Resumen completo + Conceptos clave',
              'Biblioteca temporal (15 días)'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="text-green-600 font-bold" size={20} />
                <span className="font-bold uppercase text-sm tracking-tight dark:text-[#f9f9f9]">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PRO PLAN */}
        <section className="p-0 border-b-4 border-[#1a1c1c] dark:border-[#f9f9f9]">
          <div className="p-6 bg-[#b1241a] text-white border-b-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
            <h3 className="text-4xl font-black uppercase tracking-tighter">PRO</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black">8.99€</span>
              <span className="text-sm font-bold uppercase">/mes</span>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {[
              '30 análisis/día',
              'Historial PERMANENTE',
              'EXPORTAR A PDF',
              'DESCARGAR análisis',
              'Memory system',
              'Estadísticas personales',
              'Soporte por email'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="text-green-600 font-bold" size={20} />
                <span className="font-black uppercase text-sm tracking-tight dark:text-[#f9f9f9]">{feature}</span>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6">
            <button 
              onClick={() => navigate('/subscription')}
              className="w-full bg-[#b1241a] text-white text-2xl font-black py-6 uppercase tracking-tighter hover:bg-[#910807] active:scale-95 transition-all"
            >
              SUSCRIBIRSE A PRO
            </button>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-left dark:text-[#dcdddd]">
          CANCELACIÓN EN CUALQUIER MOMENTO. TÉRMINOS Y CONDICIONES APLICABLES.
        </p>
      </div>
    </Layout>
  );
};

export default Plans;

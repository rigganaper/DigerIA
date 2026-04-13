import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Download } from 'lucide-react';

const Export = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};
  const [selected, setSelected] = useState({
    resumen: true,
    conceptos: true,
    sugerencia: false,
    score: true
  });

  if (!result) return <Layout>No result to export.</Layout>;

  const handleDownload = () => {
    alert("Descargando archivo...");
    navigate('/result', { state: { result } });
  };

  return (
    <Layout showBack>
      <section className="max-w-xl mx-auto space-y-12">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4 dark:text-[#f9f9f9]">EXPORTAR ANÁLISIS</h1>
          <div className="h-2 w-24 bg-[#b1241a] mb-8"></div>
        </div>

        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#5d5f5f] dark:text-[#dcdddd]">Selección de Contenido</h2>
          <div className="space-y-4">
            {[
              { id: 'resumen', label: 'Resumen Ejecutivo' },
              { id: 'conceptos', label: '5 Conceptos Clave' },
              { id: 'sugerencia', label: 'Sugerencia de Acción' },
              { id: 'score', label: 'Score de Calidad' }
            ].map((opt) => (
              <label 
                key={opt.id}
                className="flex items-center justify-between p-4 border-2 border-[#1a1c1c] dark:border-[#f9f9f9] group cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#1a1c1c] transition-none dark:text-[#f9f9f9]"
              >
                <span className="font-bold text-lg">{opt.label}</span>
                <input 
                  type="checkbox" 
                  checked={selected[opt.id as keyof typeof selected]}
                  onChange={() => setSelected(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof selected] }))}
                  className="w-6 h-6 border-2 border-[#1a1c1c] dark:border-[#f9f9f9] text-[#b1241a] focus:ring-0 rounded-none bg-transparent"
                />
              </label>
            ))}
          </div>
        </div>

        <button 
          onClick={handleDownload}
          className="w-full bg-[#b1241a] text-white py-6 px-8 font-black text-2xl uppercase tracking-tighter flex items-center justify-between hover:bg-[#b1241a]/90 transition-none border-b-8 border-r-8 border-[#1a1c1c] dark:border-[#f9f9f9]"
        >
          <span>DESCARGAR ARCHIVO</span>
          <Download size={40} />
        </button>
      </section>
    </Layout>
  );
};

export default Export;

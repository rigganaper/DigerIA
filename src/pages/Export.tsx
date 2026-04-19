import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Download } from 'lucide-react';

const Export = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    result?.sections.map((s: any) => s.type) || []
  );

  if (!result) return <Layout>No result to export.</Layout>;

  const handleDownload = () => {
    if (!result) return;

    let exportContent = `# ${result.title}\n\n`;

    result.sections.forEach((section: any) => {
      if (selectedTypes.includes(section.type)) {
        exportContent += `## ${section.title}\n`;
        if (typeof section.content === 'string') {
          exportContent += `${section.content}\n\n`;
        } else if (Array.isArray(section.content)) {
          section.content.forEach((item: any) => {
            if (typeof item === 'string') {
              exportContent += `- ${item}\n`;
            } else {
              exportContent += `- **${item.title || item.step || item.concept || 'Item'}**: ${item.description || item.content || item.definition || JSON.stringify(item)}\n`;
            }
          });
          exportContent += `\n`;
        } else {
          exportContent += `${JSON.stringify(section.content, null, 2)}\n\n`;
        }
      }
    });

    const blob = new Blob([exportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '_')}_Análisis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Descarga iniciada correctamente.");
    navigate('/result', { state: { result } });
  };

  return (
    <Layout showBack>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <header className="mb-16 border-b-8 border-[#1a1c1c] dark:border-[#f9f9f9] pb-8">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-6 dark:text-[#f9f9f9]">
            EXPORTAR_DATOS
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest text-[#b1241a]">SISTEMA DE SALIDA DE CAPITAL INTELECTUAL</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Configuration Area */}
          <div className="lg:col-span-5 space-y-12">
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1c1c] dark:text-[#f9f9f9] opacity-60">CONFIGURACIÓN DE SALIDA</h2>
                <button 
                  onClick={() => setSelectedTypes(selectedTypes.length === result.sections.length ? [] : result.sections.map((s: any) => s.type))}
                  className="text-[0.6rem] font-black uppercase underline hover:text-[#b1241a] dark:text-[#f9f9f9]"
                >
                  {selectedTypes.length === result.sections.length ? 'DESELECCIONAR_TODO' : 'SELECCIONAR_TODO'}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {result.sections.map((section: any) => (
                  <label 
                    key={section.type}
                    className={cn(
                      "flex items-center justify-between p-6 border-4 cursor-pointer transition-all",
                      selectedTypes.includes(section.type)
                        ? "border-[#b1241a] bg-[#fdf2f1] dark:bg-[#2d1210]" 
                        : "border-[#1a1c1c] dark:border-[#f9f9f9] bg-white dark:bg-[#1a1c1c] hover:bg-[#f9f9f9]"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-black text-xl dark:text-[#f9f9f9] uppercase">{section.title}</span>
                      <span className="text-[0.6rem] font-bold opacity-40 uppercase tracking-widest dark:text-[#f9f9f9]">FORMATO: {Array.isArray(section.content) ? 'LISTA' : 'TEXTO_PLANO'}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(section.type)}
                      onChange={() => {
                        setSelectedTypes(prev => 
                          prev.includes(section.type) 
                            ? prev.filter(t => t !== section.type)
                            : [...prev, section.type]
                        );
                      }}
                      className="w-8 h-8 border-4 border-[#1a1c1c] dark:border-[#f9f9f9] text-[#b1241a] focus:ring-0 rounded-none bg-transparent"
                    />
                  </label>
                ))}
              </div>
            </section>

            <button 
              onClick={handleDownload}
              disabled={selectedTypes.length === 0}
              className={cn(
                "w-full px-8 py-8 font-black text-3xl uppercase tracking-tighter flex items-center justify-between border-b-8 border-r-8 transition-all",
                selectedTypes.length > 0
                  ? "bg-[#b1241a] text-white border-[#1a1c1c] dark:border-[#f9f9f9] hover:-translate-y-1 hover:shadow-xl"
                  : "bg-zinc-400 text-zinc-200 border-zinc-500 cursor-not-allowed opacity-50"
              )}
            >
              <span>INICIAR_DESCARGA</span>
              <Download size={48} />
            </button>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-7">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1c1c] dark:text-[#f9f9f9] opacity-60 mb-8">PREVISUALIZACIÓN_DE_SÍNTESIS</h2>
            <div className="border-8 border-[#1a1c1c] dark:border-[#f9f9f9] bg-[#f9f9f9] dark:bg-[#121212] p-10 h-[600px] overflow-y-auto scrollbar-hide font-mono">
              <div className="space-y-12">
                <div className="border-b-2 border-dashed border-[#1a1c1c]/20 dark:border-[#f9f9f9]/20 pb-4">
                  <p className="text-[0.6rem] mb-2 opacity-40 uppercase tracking-widest">ESTRUCTURA_HEADER</p>
                  <h3 className="text-3xl font-black uppercase dark:text-[#f9f9f9]">{result.title}</h3>
                </div>

                {result.sections.filter((s: any) => selectedTypes.includes(s.type)).map((s: any) => (
                  <div key={s.type} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-[#b1241a] font-black uppercase text-sm tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#b1241a]"></span>
                      {s.title}
                    </h4>
                    <div className="text-sm font-bold leading-relaxed opacity-80 dark:text-[#f9f9f9]">
                      {typeof s.content === 'string' ? (
                        <p>{s.content.substring(0, 300)}{s.content.length > 300 ? '...' : ''}</p>
                      ) : (
                        <ul className="space-y-2">
                          {s.content.slice(0, 3).map((item: any, i: number) => (
                            <li key={i} className="flex gap-4">
                              <span className="opacity-30">0{i+1}</span>
                              <span>{item.title || item.step || item.concept || (typeof item === 'string' ? item : 'Item')}</span>
                            </li>
                          ))}
                          {s.content.length > 3 && <li className="opacity-30">... Y {s.content.length - 3} ELEMENTOS MÁS</li>}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}

                {selectedTypes.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                    <Download size={80} className="mb-4" />
                    <p className="font-black uppercase tracking-widest">Sin contenido seleccionado</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between text-[0.65rem] font-black uppercase tracking-widest opacity-40 dark:text-[#f9f9f9]">
              <span>FORMATO: MARKDOWN (.md)</span>
              <span>ENCODING: UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Export;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Download, CheckCircle2, ListOrdered, Clock, Zap, AlertTriangle, Book, HelpCircle, Table as TableIcon, Lightbulb } from 'lucide-react';
import { AnalysisSection } from '../types';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  if (!result) {
    return <Layout>No result found.</Layout>;
  }

  const renderSection = (section: AnalysisSection, index: number) => {
    const iconMap: Record<string, any> = {
      SUMMARY: <Zap className="text-[#b1241a]" size={20} />,
      CONCEPTS: <Lightbulb className="text-[#b1241a]" size={20} />,
      TIMELINE: <Clock className="text-[#b1241a]" size={20} />,
      ACTION_PLAN: <ListOrdered className="text-[#b1241a]" size={20} />,
      TECHNICAL: <Zap className="text-[#b1241a]" size={20} />,
      CRITIQUE: <AlertTriangle className="text-[#b1241a]" size={20} />,
      GLOSSARY: <Book className="text-[#b1241a]" size={20} />,
      'Q&A': <HelpCircle className="text-[#b1241a]" size={20} />,
      TABLE: <TableIcon className="text-[#b1241a]" size={20} />,
      METAPHOR: <Zap className="text-[#b1241a]" size={20} />,
    };

    const Icon = iconMap[section.type] || <CheckCircle2 className="text-[#b1241a]" size={20} />;

    return (
      <div key={index} className="space-y-6 border-b-2 border-[#1a1c1c] dark:border-[#f9f9f9] pb-12 last:border-0">
        <div className="flex items-center gap-3">
          {Icon}
          <h3 className="text-[1.25rem] font-black tracking-tighter uppercase dark:text-[#f9f9f9]">{section.title}</h3>
        </div>

        {section.type === 'SUMMARY' && (
          <div className="border-l-4 border-[#1a1c1c] dark:border-[#f9f9f9] pl-6 py-2">
            <p className="text-lg font-medium leading-relaxed dark:text-[#f9f9f9]">{section.content}</p>
          </div>
        )}

        {section.type === 'CONCEPTS' && Array.isArray(section.content) && (
          <div className="bg-[#eeeeee] dark:bg-[#1a1c1c] p-8 grid grid-cols-1 gap-6 border-2 border-transparent dark:border-[#f9f9f9]">
            {section.content.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-xl font-black text-[#b1241a]">0{i + 1}</span>
                <div>
                  <h4 className="font-bold uppercase text-sm mb-1 dark:text-[#f9f9f9]">{item.title}</h4>
                  <p className="text-sm text-[#5d5f5f] dark:text-[#dcdddd]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {section.type === 'TIMELINE' && Array.isArray(section.content) && (
          <div className="space-y-4">
            {section.content.map((item: any, i: number) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#b1241a] rounded-full"></div>
                  <div className="w-px h-full bg-[#1a1c1c] dark:bg-[#f9f9f9] opacity-20"></div>
                </div>
                <div className="pb-4">
                  <span className="text-[0.65rem] font-black uppercase text-[#b1241a]">{item.date || item.time}</span>
                  <h4 className="font-bold uppercase text-sm dark:text-[#f9f9f9]">{item.event || item.title}</h4>
                  <p className="text-sm text-[#5d5f5f] dark:text-[#dcdddd]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {section.type === 'ACTION_PLAN' && Array.isArray(section.content) && (
          <div className="space-y-4">
            {section.content.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#f3f3f4] dark:bg-[#1a1c1c] border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
                <div className="w-8 h-8 bg-[#1a1c1c] dark:bg-[#333333] text-white dark:text-white flex items-center justify-center font-black text-xs border dark:border-[#f9f9f9]">
                  {i + 1}
                </div>
                <p className="text-sm font-bold uppercase dark:text-[#f9f9f9]">{typeof item === 'string' ? item : item.step}</p>
              </div>
            ))}
          </div>
        )}

        {section.type === 'TABLE' && Array.isArray(section.content) && section.content.length > 0 && (
          <div className="overflow-x-auto border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1c1c] dark:bg-[#1a1c1c] text-white dark:text-white uppercase text-[0.65rem] font-black">
                <tr>
                  {Object.keys(section.content[0]).map((key) => (
                    <th key={key} className="px-4 py-3 border-b-2 border-white/10">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1c1c] dark:divide-[#f9f9f9]">
                {section.content.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-[#f3f3f4] dark:hover:bg-[#121212]">
                    {Object.values(row).map((val: any, j: number) => (
                      <td key={j} className="px-4 py-3 font-medium dark:text-[#f9f9f9]">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Fallback for other types or string content */}
        {!['SUMMARY', 'CONCEPTS', 'TIMELINE', 'ACTION_PLAN', 'TABLE'].includes(section.type) && (
          <div className="text-sm leading-relaxed text-[#5d5f5f] dark:text-[#dcdddd] whitespace-pre-wrap">
            {typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2)}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <section className="mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <h2 className="text-[3.5rem] font-black tracking-tighter uppercase leading-none dark:text-[#f9f9f9]">RESULTADO</h2>
            <button 
              onClick={() => navigate('/export', { state: { result } })}
              className="bg-[#b1241a] text-white p-3 flex items-center justify-center hover:brightness-110 active:scale-95 transition-all h-14 w-14"
            >
              <Download size={24} />
            </button>
          </div>
          <div className="h-2 w-24 bg-[#b1241a] mt-2"></div>
        </div>
        <div className="hidden sm:block text-[0.75rem] font-black uppercase tracking-widest text-[#5d5f5f] dark:text-[#f9f9f9] opacity-50">
          {result.title}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 space-y-16">
          {result.sections?.map((section: any, index: number) => renderSection(section, index))}
        </div>

        <div className="md:col-span-4 space-y-8 sticky top-8">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/library')}
              className="bg-[#b1241a] text-white font-black text-sm uppercase py-4 px-8 tracking-widest hover:brightness-110 transition-none text-left"
            >
              VOLVER A BIBLIOTECA
            </button>
            <button 
              onClick={() => navigate('/analyze')}
              className="bg-[#1a1c1c] dark:bg-[#1a1c1c] text-white dark:text-white font-black text-sm uppercase py-4 px-8 tracking-widest hover:bg-[#5d5f5f] dark:hover:bg-[#333333] transition-none text-left border-2 border-transparent dark:border-[#f9f9f9]"
            >
              NUEVO ANÁLISIS
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Result;

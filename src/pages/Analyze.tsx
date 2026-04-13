import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../AuthContext';
import { Upload, FileText, ChevronDown, Loader2 } from 'lucide-react';
import mammoth from 'mammoth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { PromptTemplate } from '../types';

const Analyze = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [analysisType, setAnalysisType] = useState('EJECUTIVO');
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [customPrompts, setCustomPrompts] = useState<PromptTemplate[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchPrompts = async () => {
      const q = query(collection(db, 'prompts'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      setCustomPrompts(snap.docs.map(d => ({ id: d.id, ...d.data() } as PromptTemplate)));
    };
    fetchPrompts();
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Handle DOCX by extracting text
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setContent(result.value);
        setFileData(null);
      } else {
        // Handle other files (PDF, TXT) natively via Gemini
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          setFileData({
            base64,
            mimeType: file.type || 'application/octet-stream',
            name: file.name
          });
          setContent(''); // Clear text content if file is selected
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Error al procesar el archivo. Intenta con otro formato.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleAnalyze = () => {
    if (!content.trim() && !fileData) return;
    
    // Find if analysisType is a custom prompt
    const customPrompt = customPrompts.find(p => p.name === analysisType);
    const finalPrompt = customPrompt ? customPrompt.body : analysisType;
    
    navigate('/processing', { state: { content, analysisType: finalPrompt, fileData, typeName: analysisType } });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Uso del día section */}
        <div className="border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 bg-[#f3f3f4] dark:bg-[#1a1c1c] transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#1a1c1c] dark:text-[#f9f9f9]">2 USOS DEL DÍA</span>
            <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#b1241a]">
              {profile?.creditsUsed || 0} / {profile?.maxCredits || 20} Créditos
            </span>
          </div>
          <div className="w-full h-4 bg-[#f9f9f9] dark:bg-[#121212] border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
            <div 
              className="h-full bg-[#b1241a]" 
              style={{ width: `${((profile?.creditsUsed || 0) / (profile?.maxCredits || 20)) * 100}%` }}
            ></div>
          </div>
        </div>

        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#1a1c1c] dark:text-[#f9f9f9] uppercase leading-none text-left">
          ANALIZAR
        </h1>

        <section className="mt-4 max-w-3xl">
          <div className="flex flex-col gap-0 border-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
            {/* Selector Header */}
            <div className="flex border-b-2 border-[#1a1c1c] dark:border-[#f9f9f9]">
              <button className="flex-1 py-4 text-[0.75rem] font-black uppercase tracking-widest transition-none bg-[#b1241a] text-white">
                URL / TEXTO / ARCHIVO
              </button>
            </div>

            {/* Unified Content Area */}
            <div className="p-8 bg-white dark:bg-[#1a1c1c]">
              <label className="text-[0.75rem] font-black uppercase text-[#1a1c1c] dark:text-[#f9f9f9] mb-4 block tracking-tighter">
                SUBIR / ANALIZAR CONTENIDO
              </label>
              
              <div className="flex flex-col gap-6">
                {/* Input Area */}
                <div className="relative">
                  <textarea 
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (e.target.value) setFileData(null);
                    }}
                    className="w-full h-40 bg-[#f9f9f9] dark:bg-[#121212] border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 font-sans text-lg focus:ring-0 focus:border-[#b1241a] dark:focus:border-[#b1241a] transition-none rounded-none outline-none resize-none dark:text-[#f9f9f9]" 
                    placeholder="Pega aquí tu URL o el texto que deseas procesar..."
                  ></textarea>
                </div>

                <div className="relative flex items-center gap-4">
                  <div className="h-px bg-[#1a1c1c] dark:bg-[#f9f9f9] flex-grow opacity-20"></div>
                  <span className="text-[0.6rem] font-black uppercase opacity-60 dark:text-[#f9f9f9]">O sube un archivo</span>
                  <div className="h-px bg-[#1a1c1c] dark:bg-[#f9f9f9] flex-grow opacity-20"></div>
                </div>

                {/* Upload Area */}
                <label className="w-full aspect-[4/1] border-2 border-dashed border-[#1a1c1c] dark:border-[#f9f9f9] bg-[#f3f3f4] dark:bg-[#121212] flex items-center justify-center p-4 transition-none hover:bg-[#eeeeee] dark:hover:bg-[#1a1c1c] cursor-pointer group">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    disabled={isParsing}
                  />
                  <div className="flex items-center gap-4">
                    {isParsing ? (
                      <Loader2 className="animate-spin text-[#b1241a]" size={32} />
                    ) : (
                      <Upload className="text-[#1a1c1c] dark:text-[#f9f9f9] group-hover:scale-110 transition-transform" />
                    )}
                    <div className="flex flex-col">
                      <p className="text-[0.7rem] font-black uppercase tracking-tight dark:text-[#f9f9f9]">
                        {isParsing ? "PROCESANDO ARCHIVO..." : fileData ? fileData.name : content ? "TEXTO EXTRAÍDO" : "ARRASTRAR DOCUMENTO O BUSCAR"}
                      </p>
                      <p className="text-[9px] opacity-60 font-bold uppercase dark:text-[#f9f9f9]">PDF, DOCX, TXT (MAX. 25MB)</p>
                    </div>
                  </div>
                </label>

                <div className="mt-4">
                  <label className="text-[0.75rem] font-black uppercase text-[#1a1c1c] dark:text-[#f9f9f9] mb-4 block tracking-tighter">
                    TIPO DE ANÁLISIS / PROMPT
                  </label>
                  <div className="relative">
                    <select 
                      value={analysisType}
                      onChange={(e) => setAnalysisType(e.target.value)}
                      className="w-full bg-[#f9f9f9] dark:bg-[#121212] border-2 border-[#1a1c1c] dark:border-[#f9f9f9] px-4 py-4 font-black uppercase text-[0.75rem] tracking-widest focus:ring-0 focus:border-[#b1241a] appearance-none cursor-pointer rounded-none dark:text-[#f9f9f9]"
                    >
                      <option value="EJECUTIVO">EJECUTIVO</option>
                      <option value="TECNICO">TÉCNICO</option>
                      <option value="CREATIVO">CREATIVO</option>
                      {customPrompts.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 border-l-2 border-[#1a1c1c] dark:border-[#f9f9f9] bg-[#f9f9f9] dark:bg-[#121212]">
                      <ChevronDown size={18} className="dark:text-[#f9f9f9]" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    onClick={handleAnalyze}
                    className="bg-[#b1241a] text-white px-10 py-5 text-[0.75rem] font-black uppercase tracking-widest hover:brightness-110 transition-none w-full md:w-auto"
                  >
                    ANALIZAR CONTENIDO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Analyze;

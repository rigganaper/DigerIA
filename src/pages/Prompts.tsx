import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { PromptTemplate } from '../types';
import { cn } from '../lib/utils';
import { PlusCircle, Edit, Trash2, Eye, Copy, Check, X } from 'lucide-react';

const Prompts = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<PromptTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchPrompts = async () => {
      const q = query(collection(db, 'prompts'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      setPrompts(snap.docs.map(d => ({ id: d.id, ...d.data() } as PromptTemplate)));
    };
    fetchPrompts();
  }, [user]);

  const handleSave = async () => {
    if (!user || !name || !body) return;
    
    try {
      if (editingId) {
        // Update existing
        const promptRef = doc(db, 'prompts', editingId);
        await setDoc(promptRef, {
          userId: user.uid,
          name,
          description,
          body,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        setPrompts(prompts.map(p => p.id === editingId ? { ...p, name, description, body } : p));
        setEditingId(null);
      } else {
        // Create new
        const newPrompt = {
          userId: user.uid,
          name,
          description,
          body,
          createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'prompts'), newPrompt);
        setPrompts([{ id: docRef.id, ...newPrompt }, ...prompts]);
      }
      
      setName('');
      setDescription('');
      setBody('');
    } catch (error) {
      console.error("Error saving prompt:", error);
      alert("Error al guardar el prompt.");
    }
  };

  const handleEdit = (prompt: PromptTemplate) => {
    setEditingId(prompt.id);
    setName(prompt.name);
    setDescription(prompt.description || '');
    setBody(prompt.body);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar este prompt?")) return;
    await deleteDoc(doc(db, 'prompts', id));
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const handleCopy = (prompt: PromptTemplate) => {
    navigator.clipboard.writeText(prompt.body);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <h1 className="text-[3.5rem] md:text-[8rem] font-black leading-[0.8] tracking-tighter uppercase dark:text-[#f9f9f9]">
          PROMPTS
        </h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setName('');
            setDescription('');
            setBody('');
            document.getElementById('prompt-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#b1241a] text-white px-8 py-4 border-4 border-[#1a1c1c] dark:border-[#f9f9f9] flex items-center gap-4 transition-transform hover:scale-105 active:scale-95"
        >
          <PlusCircle size={24} />
          <span className="text-lg font-black uppercase tracking-tight">NUEVA PLANTILLA</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar: List of Prompts */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-4 border-[#1a1c1c] dark:border-[#f9f9f9]">
            <h2 className="text-2xl font-black uppercase dark:text-[#f9f9f9]">MIS BIBLIOTECA</h2>
            <span className="bg-[#1a1c1c] dark:bg-[#f9f9f9] text-white dark:text-[#1a1c1c] px-3 py-1 text-xs font-black">{prompts.length}</span>
          </div>
          
          <div className="flex flex-col gap-6">
            {prompts.map((p) => (
              <div key={p.id} className={cn(
                "group border-4 p-6 transition-all duration-200",
                editingId === p.id 
                  ? "border-[#b1241a] bg-[#fdf2f1] dark:bg-[#2d1210]" 
                  : "border-[#1a1c1c] dark:border-[#f9f9f9] bg-[#f9f9f9] dark:bg-[#1a1c1c] hover:translate-x-2"
              )}>
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-[#1a1c1c] dark:bg-[#333333]">
                    <span className="text-white text-[0.65rem] font-black uppercase tracking-widest">PROTOCOLO</span>
                  </div>
                  <div className="flex gap-4 dark:text-[#f9f9f9]">
                    <button onClick={() => setViewingPrompt(p)} className="hover:text-[#b1241a] transition-colors" title="Visualizar"><Eye size={20} /></button>
                    <button onClick={() => handleEdit(p)} className="hover:text-[#b1241a] transition-colors" title="Editar"><Edit size={20} /></button>
                    <button onClick={() => handleCopy(p)} className="hover:text-[#b1241a] transition-colors" title="Copiar">
                      {copiedId === p.id ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="hover:text-[#b1241a] transition-colors" title="Eliminar"><Trash2 size={20} /></button>
                  </div>
                </div>
                <h3 className="text-2xl font-black uppercase mb-1 dark:text-[#f9f9f9] leading-tight">{p.name}</h3>
                {p.description && (
                  <p className="text-[0.65rem] font-black text-[#b1241a] uppercase mb-3 tracking-tighter">ESTILO: {p.description}</p>
                )}
                <p className="text-sm font-medium text-[#5d5f5f] dark:text-[#dcdddd] leading-snug line-clamp-2 italic opacity-80">
                  "{p.body}"
                </p>
              </div>
            ))}
            {prompts.length === 0 && (
              <div className="text-center py-20 border-4 border-dashed border-[#1a1c1c] dark:border-[#f9f9f9] opacity-30">
                <p className="font-black uppercase tracking-widest">Sin plantillas guardadas</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Form */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <section id="prompt-form" className="sticky top-24 p-10 border-8 border-[#1a1c1c] dark:border-[#f9f9f9] bg-white dark:bg-[#1a1c1c] shadow-[16px_16px_0px_0px_rgba(26,28,28,1)] dark:shadow-[16px_16px_0px_0px_rgba(249,249,249,0.1)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-4 h-4 bg-[#b1241a]"></div>
              <h2 className="text-4xl font-black uppercase dark:text-[#f9f9f9] tracking-tighter">
                {editingId ? 'MODIFICAR PROTOCOLO' : 'NUEVO PROTOCOLO'}
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1c1c] dark:text-[#f9f9f9] opacity-60">IDENTIFICADOR</label>
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-5 text-xl font-black uppercase placeholder:text-[#5f6161]/30 focus:ring-4 focus:ring-[#b1241a]/20 outline-none bg-[#f9f9f9] dark:bg-[#121212] dark:text-[#f9f9f9] transition-all" 
                  placeholder="NOMBRE DEL PROMPT" 
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1c1c] dark:text-[#f9f9f9] opacity-60">DESCRIPCIÓN DEL ESTILO / USO</label>
                <input 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-5 text-lg font-bold placeholder:text-[#5f6161]/30 focus:ring-4 focus:ring-[#b1241a]/20 outline-none bg-[#f9f9f9] dark:bg-[#121212] dark:text-[#f9f9f9] transition-all" 
                  placeholder="Ej. Técnico, sarcástico, resumen para ejecutivos..." 
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1c1c] dark:text-[#f9f9f9] opacity-60">INSTRUCCIONES DEL MOTOR</label>
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-5 text-lg font-bold leading-tight focus:ring-4 focus:ring-[#b1241a]/20 outline-none bg-[#f9f9f9] dark:bg-[#121212] dark:text-[#f9f9f9] resize-none h-[300px]" 
                  placeholder="Escribe aquí las directrices para la IA..." 
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-[#b1241a] text-white px-10 py-6 font-black uppercase text-xl tracking-tight border-4 border-[#1a1c1c] dark:border-[#f9f9f9] hover:bg-[#1a1c1c] dark:hover:bg-[#333333] transition-colors shadow-[8px_8px_0px_0px_rgba(26,28,28,0.2)]"
                >
                  {editingId ? 'ACTUALIZAR_SISTEMA' : 'DESPLEGAR_PROMPT'}
                </button>
                {editingId && (
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setName('');
                      setDescription('');
                      setBody('');
                    }}
                    className="px-8 py-6 border-4 border-[#1a1c1c] dark:border-[#f9f9f9] font-black uppercase text-sm hover:bg-[#eeeeee] dark:hover:bg-[#333333] dark:text-[#f9f9f9]"
                  >
                    DESCARTAR
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Viewing Modal */}
      {viewingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-[#1a1c1c]/95 backdrop-blur-sm" onClick={() => setViewingPrompt(null)}></div>
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1c1c] border-8 border-[#b1241a] p-8 md:p-16 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setViewingPrompt(null)}
              className="absolute top-8 right-8 text-[#1a1c1c] dark:text-[#f9f9f9] hover:text-[#b1241a] transition-colors"
            >
              <X size={48} />
            </button>
            
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <div className="inline-block bg-[#b1241a] px-4 py-1">
                  <span className="text-white text-xs font-black uppercase tracking-[0.3em]">PROTOCOLO</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter dark:text-[#f9f9f9]">
                  {viewingPrompt.name}
                </h2>
                {viewingPrompt.description && (
                  <p className="text-lg font-black text-[#b1241a] uppercase tracking-widest">{viewingPrompt.description}</p>
                )}
              </div>
              
              <div className="h-2 w-24 bg-[#b1241a]"></div>
              
              <div className="bg-[#f9f9f9] dark:bg-[#121212] p-8 border-l-8 border-[#b1241a]">
                <p className="text-xl md:text-2xl font-bold leading-relaxed text-[#1a1c1c] dark:text-[#f9f9f9] whitespace-pre-wrap font-mono">
                  {viewingPrompt.body}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    handleEdit(viewingPrompt);
                    setViewingPrompt(null);
                  }}
                  className="bg-[#1a1c1c] dark:bg-[#f9f9f9] text-white dark:text-[#1a1c1c] px-8 py-4 font-black uppercase"
                >
                  EDITAR ESTE PROMPT
                </button>
                <button 
                  onClick={() => handleCopy(viewingPrompt)}
                  className="border-4 border-[#1a1c1c] dark:border-[#f9f9f9] px-8 py-4 font-black uppercase dark:text-[#f9f9f9] flex items-center gap-2"
                >
                  {copiedId === viewingPrompt.id ? (
                    <>COPIADO <Check size={20} /></>
                  ) : (
                    <>COPIAR CÓDIGO <Copy size={20} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Prompts;

import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { PromptTemplate } from '../types';
import { cn } from '../lib/utils';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const Prompts = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<'TECHNICAL' | 'DATA' | 'CREATIVE'>('TECHNICAL');

  const [editingId, setEditingId] = useState<string | null>(null);

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
          body,
          category,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        setPrompts(prompts.map(p => p.id === editingId ? { ...p, name, body, category } : p));
        setEditingId(null);
      } else {
        // Create new
        const newPrompt = {
          userId: user.uid,
          name,
          body,
          category,
          createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'prompts'), newPrompt);
        setPrompts([{ id: docRef.id, ...newPrompt }, ...prompts]);
      }
      
      setName('');
      setBody('');
    } catch (error) {
      console.error("Error saving prompt:", error);
      alert("Error al guardar el prompt.");
    }
  };

  const handleEdit = (prompt: PromptTemplate) => {
    setEditingId(prompt.id);
    setName(prompt.name);
    setBody(prompt.body);
    setCategory(prompt.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar este prompt?")) return;
    await deleteDoc(doc(db, 'prompts', id));
    setPrompts(prompts.filter(p => p.id !== id));
  };

  return (
    <Layout>
      <h1 className="text-[3.5rem] md:text-[6rem] font-black leading-none tracking-tighter uppercase mb-12 text-left dark:text-[#f9f9f9]">
        PROMPTS
      </h1>

      <div className="mb-16">
        <button 
          onClick={() => {
            setEditingId(null);
            setName('');
            setBody('');
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          className="bg-[#b1241a] text-white px-8 py-6 border-4 border-[#1a1c1c] dark:border-[#f9f9f9] flex items-center gap-4 transition-none active:translate-y-1"
        >
          <PlusCircle size={32} />
          <span className="text-xl font-black uppercase tracking-tight">NUEVO PROMPT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section id="prompt-form" className="p-8 border-4 border-[#1a1c1c] dark:border-[#f9f9f9] bg-white dark:bg-[#1a1c1c]">
            <h2 className="text-[1.75rem] font-black uppercase mb-8 text-left dark:text-[#f9f9f9]">
              {editingId ? 'EDITAR PROMPT' : 'ESCRIBIR PROMPT'}
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-[#1a1c1c] dark:text-[#f9f9f9]">NOMBRE DEL PROMPT</label>
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 text-lg font-bold placeholder:text-[#5f6161] focus:ring-0 focus:outline-none bg-[#f9f9f9] dark:bg-[#121212] dark:text-[#f9f9f9]" 
                  placeholder="Ej. Extracción Técnica de Datos" 
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-widest text-[#1a1c1c] dark:text-[#f9f9f9]">CUERPO DEL PROMPT</label>
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-4 text-lg font-medium leading-relaxed focus:ring-0 focus:outline-none bg-[#f9f9f9] dark:bg-[#121212] dark:text-[#f9f9f9] resize-none" 
                  placeholder="Escribe aquí las instrucciones para la IA..." 
                  rows={8}
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-[#1a1c1c] dark:bg-[#333333] text-white dark:text-white px-10 py-4 font-black uppercase tracking-tight border-2 border-[#1a1c1c] dark:border-[#f9f9f9] hover:bg-[#b1241a] dark:hover:bg-[#b1241a]"
                >
                  {editingId ? 'ACTUALIZAR' : 'GUARDAR PLANTILLA'}
                </button>
                {editingId && (
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setName('');
                      setBody('');
                    }}
                    className="px-6 py-4 border-2 border-[#1a1c1c] dark:border-[#f9f9f9] font-black uppercase text-xs"
                  >
                    CANCELAR
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-[1.75rem] font-black uppercase mb-8 text-left dark:text-[#f9f9f9]">MIS PROMPTS GUARDADOS</h2>
          <div className="flex flex-col gap-4">
            {prompts.map((p) => (
              <div key={p.id} className="group border-2 border-[#1a1c1c] dark:border-[#f9f9f9] p-6 bg-[#f9f9f9] dark:bg-[#1a1c1c] hover:bg-[#e8e8e8] dark:hover:bg-[#121212] transition-none">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "px-2 py-1",
                    p.category === 'TECHNICAL' ? "bg-[#b1241a]" : p.category === 'DATA' ? "bg-[#1a1c1c] dark:bg-[#333333]" : "bg-[#dcdddd]"
                  )}>
                    <span className={cn(
                      "text-[0.6rem] font-black uppercase tracking-tighter",
                      p.category === 'CREATIVE' ? "text-[#1a1c1c]" : "text-white"
                    )}>{p.category}</span>
                  </div>
                  <div className="flex gap-2 dark:text-[#f9f9f9]">
                    <button onClick={() => handleEdit(p)} className="hover:text-[#b1241a]"><Edit size={20} /></button>
                    <button onClick={() => handleDelete(p.id)} className="hover:text-[#b1241a]"><Trash2 size={20} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-black uppercase mb-2 dark:text-[#f9f9f9]">{p.name}</h3>
                <p className="text-sm font-medium text-[#5d5f5f] dark:text-[#dcdddd] leading-snug truncate">{p.body}</p>
              </div>
            ))}
            {prompts.length === 0 && (
              <p className="text-center py-12 font-bold uppercase opacity-40 dark:text-[#f9f9f9]">No tienes prompts guardados.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Prompts;

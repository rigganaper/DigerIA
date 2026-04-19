import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
import { Folder, Analysis } from '../types';
import { Search, FolderPlus, FileText, PlayCircle, Mic, File as FileIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Library = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const analysesQuery = query(
        collection(db, 'analyses'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const analysesSnap = await getDocs(analysesQuery);
      setAnalyses(analysesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Analysis)));

      const foldersQuery = query(
        collection(db, 'folders'),
        where('userId', '==', user.uid)
      );
      const foldersSnap = await getDocs(foldersQuery);
      setFolders(foldersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder)));
    };

    fetchData();
  }, [user]);

  const filteredAnalyses = analyses.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolderId ? a.folderId === selectedFolderId : true;
    return matchesSearch && matchesFolder;
  });

  const handleAnalysisClick = (analysis: Analysis) => {
    navigate('/result', { state: { result: analysis } });
  };

  const selectedFolderName = folders.find(f => f.id === selectedFolderId)?.name;

  const handleCreateFolder = async () => {
    if (!user) return;
    const name = prompt("Nombre de la nueva carpeta:");
    if (!name) return;

    try {
      const docRef = await addDoc(collection(db, 'folders'), {
        userId: user.uid,
        name,
        createdAt: new Date().toISOString()
      });
      setFolders(prev => [...prev, { id: docRef.id, userId: user.uid, name, createdAt: new Date().toISOString() }]);
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Error al crear la carpeta.");
    }
  };

  return (
    <Layout>
      <section className="mb-12">
        <h2 className="text-[3.5rem] font-black tracking-tighter leading-none mb-8 dark:text-[#f9f9f9]">BIBLIOTECA</h2>
        <div className="w-full mb-12">
          <label className="block text-[0.75rem] font-bold uppercase mb-2 dark:text-[#f9f9f9]">BUSCAR...</label>
          <div className="relative flex items-center border-2 border-[#1a1c1c] dark:border-[#f9f9f9] bg-white dark:bg-[#1a1c1c]">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-4 border-none focus:ring-0 text-[#1a1c1c] dark:text-[#f9f9f9] placeholder:text-zinc-400 font-bold uppercase text-sm bg-transparent" 
              placeholder="Escribe para filtrar archivos..." 
              type="text"
            />
            <Search className="mx-4 text-[#1a1c1c] dark:text-[#f9f9f9]" />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[1.75rem] font-black tracking-tighter uppercase dark:text-[#f9f9f9]">Carpetas</h3>
          <button 
            onClick={handleCreateFolder}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1c1c] border-2 border-[#1a1c1c] dark:border-[#f9f9f9] hover:bg-[#dcdddd] dark:hover:bg-[#121212] transition-none dark:text-[#f9f9f9]"
          >
            <FolderPlus size={20} />
            <span className="text-xs font-black tracking-tighter uppercase">Nueva Carpeta</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {folders.length > 0 ? folders.map(f => (
            <div 
              key={f.id} 
              onClick={() => setSelectedFolderId(selectedFolderId === f.id ? null : f.id)}
              className={cn(
                "flex flex-col p-6 border-2 border-[#1a1c1c] transition-none cursor-pointer aspect-square justify-between",
                selectedFolderId === f.id ? "bg-[#b1241a] text-white" : "bg-white dark:bg-[#121212] dark:border-[#f9f9f9] dark:text-[#f9f9f9] hover:bg-[#dcdddd] dark:hover:bg-[#1a1c1c]"
              )}
            >
              <FolderPlus size={40} />
              <h4 className="text-sm font-bold uppercase leading-tight">{f.name}</h4>
            </div>
          )) : (
            <div className="col-span-full py-12 border-2 border-dashed border-[#1a1c1c] dark:border-[#f9f9f9] flex flex-col items-center justify-center bg-white/50 dark:bg-[#1a1c1c]/50">
              <FolderPlus size={48} className="text-[#b1241a] mb-4 opacity-50" />
              <p className="font-bold uppercase text-xs opacity-60 dark:text-[#f9f9f9]">Sin carpetas creadas.</p>
              <p className="text-[10px] uppercase opacity-40 dark:text-[#f9f9f9]">Pulsa "Nueva Carpeta" para empezar.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.75rem] font-black tracking-tighter uppercase dark:text-[#f9f9f9]">
            {selectedFolderId ? `Carpeta: ${selectedFolderName}` : "Historial Reciente"}
          </h3>
          {selectedFolderId && (
            <button 
              onClick={() => setSelectedFolderId(null)}
              className="flex items-center gap-2 text-xs font-black uppercase text-[#b1241a]"
            >
              <X size={16} />
              Ver todo
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {filteredAnalyses.map((a) => (
            <div 
              key={a.id} 
              onClick={() => handleAnalysisClick(a)}
              className="flex items-center p-4 bg-white dark:bg-[#121212] border-2 border-[#1a1c1c] dark:border-[#f9f9f9] hover:bg-[#dcdddd] dark:hover:bg-[#1a1c1c] transition-none cursor-pointer dark:text-[#f9f9f9]"
            >
              {a.contentType === 'video' ? <PlayCircle size={32} className="mr-4" /> : 
               a.contentType === 'audio' ? <Mic size={32} className="mr-4" /> : 
               <FileText size={32} className="mr-4" />}
              <div className="flex-1 min-w-0">
                <h4 className="text-[1rem] font-black tracking-tighter uppercase truncate">{a.title}</h4>
                <p className="text-[0.65rem] font-bold uppercase opacity-60">
                  {new Date(a.createdAt).toLocaleDateString()} • {a.contentType.toUpperCase()}
                </p>
              </div>
              <span className={cn(
                "ml-4 px-2 py-1 text-white text-[0.65rem] font-bold uppercase",
                a.contentType === 'text' ? 'bg-[#b1241a]' : 'bg-[#1a1c1c] dark:bg-[#333333]'
              )}>
                {a.contentType.toUpperCase()}
              </span>
            </div>
          ))}
          {filteredAnalyses.length === 0 && (
            <p className="text-center py-12 font-bold uppercase opacity-40 dark:text-[#f9f9f9]">No hay análisis {selectedFolderId ? "en esta carpeta" : "recientes"}.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Library;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Layout } from '../components/Layout';
import { Upload, Link as LinkIcon, Mic, Bolt, Folder, Settings } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (user) {
      navigate('/analyze');
    } else {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        navigate('/analyze');
      } catch (error: any) {
        console.error("Login failed", error);
        alert(`Error al iniciar sesión: ${error.message}`);
      }
    }
  };

  return (
    <Layout hideNav>
      <section className="mb-24 flex flex-col items-start">
        <h1 className="text-[#1a1c1c] dark:text-[#f9f9f9] font-black text-[clamp(2.5rem,10vw,7rem)] leading-[0.85] tracking-[-0.05em] mb-12 uppercase text-left">
          DIGERIA // ARQUITECTURA RADICAL DE APRENDIZAJE
        </h1>
        <div className="w-full border-t-8 border-[#1a1c1c] dark:border-[#f9f9f9] pt-8 flex flex-col md:flex-row gap-12">
          <p className="text-2xl font-bold uppercase leading-tight max-w-xl dark:text-[#f9f9f9]">
            Transforma datos en capital intelectual. Deja de acumular, empieza a digerir.
          </p>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-[#b1241a] font-black text-4xl mb-8 uppercase tracking-tighter">EL PROBLEMA: OBESIDAD INFORMATIVA</h2>
        <div className="border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-8 bg-[#1a1c1c] dark:bg-[#1a1c1c] text-[#f9f9f9] dark:text-[#f9f9f9]">
          <p className="text-xl md:text-3xl font-bold uppercase leading-tight">
            Guardar contenido no es aprender; es procrastinar. El cerebro humano requiere dos fases para retener información: Consumo y Digestión. Sin la segunda, el 90% de lo que ves hoy desaparecerá mañana.
          </p>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-[#1a1c1c] dark:text-[#f9f9f9] font-black text-4xl mb-12 uppercase tracking-tighter border-b-4 border-[#1a1c1c] dark:border-[#f9f9f9] pb-4">PROTOCOLO DE OPERACIONES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1c1c] dark:bg-[#333333] border-4 border-[#1a1c1c] dark:border-[#f9f9f9]">
          <div className="bg-[#f9f9f9] dark:bg-[#121212] p-10 flex flex-col">
            <div className="text-[#b1241a] font-black text-6xl mb-6">01</div>
            <h3 className="text-3xl font-black uppercase mb-4 leading-none dark:text-[#f9f9f9]">INGESTA (Consumo Inteligente)</h3>
            <p className="text-lg font-medium text-[#5d5f5f] dark:text-[#dcdddd] border-l-2 border-[#1a1c1c] dark:border-[#f9f9f9] pl-4 mb-8">
              Sube archivos o pega URLs de YouTube y la web. Capturamos la señal, eliminamos el ruido. Nuestra arquitectura soporta ingesta multiformato para que nada se pierda.
            </p>
            <div className="mt-auto flex gap-4 text-[#1a1c1c]/30 dark:text-[#f9f9f9]/30">
              <Upload size={40} />
              <LinkIcon size={40} />
              <Mic size={40} />
            </div>
          </div>

          <div className="bg-[#f9f9f9] dark:bg-[#121212] p-10 flex flex-col">
            <div className="text-[#b1241a] font-black text-6xl mb-6">02</div>
            <h3 className="text-3xl font-black uppercase mb-4 leading-none dark:text-[#f9f9f9]">FILTRO (Lente de Análisis)</h3>
            <p className="text-lg font-medium text-[#5d5f5f] dark:text-[#dcdddd] border-l-2 border-[#1a1c1c] dark:border-[#f9f9f9] pl-4 mb-8">
              Define el lente (Técnico, Ejecutivo, Creativo...) o crea el tuyo adaptado a tus necesidades. Al elegir cómo procesar la información, activas tu atención selectiva y preparas el terreno para la absorción.
            </p>
          </div>

          <div className="bg-[#f9f9f9] dark:bg-[#121212] p-10 flex flex-col">
            <div className="text-[#b1241a] font-black text-6xl mb-6">03</div>
            <h3 className="text-3xl font-black uppercase mb-4 leading-none dark:text-[#f9f9f9]">SÍNTESIS (Digestión Mecánica)</h3>
            <p className="text-lg font-medium text-[#5d5f5f] dark:text-[#dcdddd] border-l-2 border-[#1a1c1c] dark:border-[#f9f9f9] pl-4 mb-8">
              Nuestros motores neuronales desglosan la complejidad por ti. La IA "mastica" el contenido, identificando conceptos clave y estructuras lógicas a máxima velocidad de red.
            </p>
            <div className="mt-auto w-full h-8 bg-[#e2e2e2] dark:bg-[#1a1c1c] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#b1241a] opacity-50 animate-pulse" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="bg-[#f9f9f9] dark:bg-[#121212] p-10 flex flex-col">
            <div className="text-[#b1241a] font-black text-6xl mb-6">04</div>
            <h3 className="text-3xl font-black uppercase mb-4 leading-none dark:text-[#f9f9f9]">DESPLIEGUE (Retención Activa)</h3>
            <p className="text-lg font-medium text-[#5d5f5f] dark:text-[#dcdddd] border-l-2 border-[#1a1c1c] dark:border-[#f9f9f9] pl-4 mb-8">
              Recibe un resumen estructurado y un Plan de Acción inmediato. No leas para saber; lee para ejecutar.
            </p>
            <div className="mt-auto flex items-center gap-2 text-[#b1241a] font-black uppercase text-xs tracking-tighter">
              <Bolt size={16} />
              STATUS: ACTIVE
            </div>
          </div>
        </div>
      </section>

      <section className="mb-32">
        <h2 className="text-[#1a1c1c] dark:text-[#f9f9f9] font-black text-4xl mb-12 uppercase tracking-tighter">INFRAESTRUCTURA TÉCNICA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-8 bg-[#f9f9f9] dark:bg-[#121212]">
            <Folder size={40} className="mb-4 text-[#b1241a]" />
            <h4 className="text-xl font-black uppercase mb-4 dark:text-[#f9f9f9]">Biblioteca Central</h4>
            <p className="text-sm font-medium text-[#5d5f5f] dark:text-[#dcdddd] uppercase tracking-tight">Organización jerárquica para un acceso eficiente.</p>
          </div>
          <div className="border-4 border-[#1a1c1c] dark:border-[#f9f9f9] p-8 bg-[#f9f9f9] dark:bg-[#121212]">
            <Settings size={40} className="mb-4 text-[#b1241a]" />
            <h4 className="text-xl font-black uppercase mb-4 dark:text-[#f9f9f9]">Control Total</h4>
            <p className="text-sm font-medium text-[#5d5f5f] dark:text-[#dcdddd] uppercase tracking-tight">Crea prompts personalizados. Tú defines las reglas del juego.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center text-center py-20 border-t-8 border-[#1a1c1c] dark:border-[#f9f9f9]">
        <button 
          onClick={handleStart}
          className="w-full md:w-auto bg-[#b1241a] text-white font-black text-4xl px-16 py-8 uppercase tracking-tighter hover:bg-[#1a1c1c] dark:hover:bg-[#333333] transition-colors"
        >
          COMENZAR
        </button>
        <p className="mt-8 font-bold text-xs uppercase tracking-widest text-[#5d5f5f] dark:text-[#dcdddd]">INITIALIZING_SESSION</p>
      </section>

      <footer className="bg-[#1a1c1c] dark:bg-[#000000] text-[#dadada] p-12 -mx-4 md:-mx-12 lg:-mx-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-black tracking-tighter text-[#f9f9f9] uppercase">DIGERIA</h2>
            <p className="text-xs max-w-xs uppercase">Sistemas de procesamiento técnico radical para la era de la sobreinformación.</p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-xs uppercase tracking-widest">
            <div className="flex flex-col gap-4">
              <span className="text-[#b1241a] font-black">Infraestructura</span>
              <a className="hover:text-[#f9f9f9]" href="#">Status</a>
              <a className="hover:text-[#f9f9f9]" href="#">API Docs</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#b1241a] font-black">Legal</span>
              <a className="hover:text-[#f9f9f9]" href="#">Privacy</a>
              <a className="hover:text-[#f9f9f9]" href="#">Terms</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#eeeeee] opacity-20 flex justify-between text-[10px] font-black uppercase tracking-[0.3em]">
          <span>©{new Date().getFullYear()} DIGERIA_TECH</span>
          <span>All_Rights_Reserved</span>
        </div>
      </footer>
    </Layout>
  );
};

export default Landing;

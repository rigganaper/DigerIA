import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { geminiService } from '../services/gemini';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const Processing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { content, analysisType, fileData } = location.state || {};
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(['> SYSTEM_BOOT_SEQUENCE_INITIALIZED', '> CONNECTING_TO_NEURAL_CORE...']);

  useEffect(() => {
    if (!content && !fileData) {
      navigate('/analyze');
      return;
    }

    const process = async () => {
      // Realistic simulation of steps
      const totalSteps = steps.length;
      
      for (let i = 1; i <= totalSteps; i++) {
        setStep(i);
        const currentStep = steps[i-1];
        setLogs(prev => [...prev, `> EXECUTING: ${currentStep.label.toUpperCase()}`, `> STATUS: OK [${Math.floor(Math.random() * 100 + 900)}ms]`]);
        
        // Granular progress updates within each step
        const startProgress = ((i - 1) / totalSteps) * 100;
        const endProgress = (i / totalSteps) * 100;
        const iterations = 10;
        const increment = (endProgress - startProgress) / iterations;
        
        for (let j = 0; j < iterations; j++) {
          setProgress(startProgress + (increment * j));
          await new Promise(resolve => setTimeout(resolve, (Math.random() * 100) + 50));
        }
        
        setProgress(endProgress);
      }
      
      setLogs(prev => [...prev, '> FINALIZING_DIGEST...', '> SYNC_COMPLETE', '> REDIRECTING_TO_RESULT_INTERFACE']);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock result instead of calling API as requested
      const mockResult = {
        title: fileData ? fileData.name : "ANÁLISIS SIMULADO",
        sections: [
          {
            title: "RESUMEN EJECUTIVO",
            content: "Este es un análisis generado en modo simulación. El sistema ha procesado el contenido y ha identificado los puntos clave de manera estructural.",
            bulletPoints: ["Punto clave 1", "Punto clave 2", "Punto clave 3"]
          },
          {
            title: "PLAN DE ACCIÓN",
            content: "Basado en el contenido, se recomienda seguir los siguientes pasos para optimizar el aprendizaje.",
            bulletPoints: ["Revisar conceptos fundamentales", "Aplicar técnica de Feynman", "Realizar ejercicios prácticos"]
          }
        ]
      };

      if (user) {
        const analysisData = {
          userId: user.uid,
          title: mockResult.title,
          sections: mockResult.sections,
          contentType: fileData ? 'file' : 'text',
          source: fileData ? fileData.name : (content ? content.substring(0, 100) : 'Contenido simulado'),
          createdAt: new Date().toISOString(),
        };
        
        try {
          await addDoc(collection(db, 'analyses'), analysisData);
          navigate('/result', { state: { result: mockResult } });
        } catch (error) {
          console.error("Failed to save mock analysis", error);
          navigate('/analyze');
        }
      } else {
        navigate('/result', { state: { result: mockResult } });
      }
    };

    process();
  }, [content, analysisType, user, navigate, fileData]);

  const steps = [
    { id: 1, label: 'Inicializando motor neuronal...' },
    { id: 2, label: 'Analizando estructura de datos...' },
    { id: 3, label: 'Extrayendo tokens semánticos...' },
    { id: 4, label: 'Identificando entidades clave...' },
    { id: 5, label: 'Generando referencias cruzadas...' },
    { id: 6, label: 'Estructurando insights accionables...' },
    { id: 7, label: 'Optimizando formato DIGEST...' },
    { id: 8, label: 'Validando esquema JSON v2.1...' },
    { id: 9, label: 'Sincronizando con almacenamiento...' },
  ];

  return (
    <Layout hideNav>
      <div className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto py-20">
        <header className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-[#1a1c1c] dark:text-[#f9f9f9]">
              EN PROCESO...
            </h1>
            <span className="text-4xl md:text-6xl font-black text-[#b1241a] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-[#eeeeee] dark:bg-[#1a1c1c] h-[4px]">
            <div 
              className="bg-[#b1241a] h-[4px] transition-all duration-100 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-8 flex flex-col gap-0">
            {steps.map((s) => (
              <div 
                key={s.id}
                className={`border-t-2 border-[#1a1c1c] dark:border-[#f9f9f9] py-6 flex justify-between items-center transition-none ${step === s.id ? 'bg-[#f3f3f4] dark:bg-[#1a1c1c]' : 'bg-[#f9f9f9] dark:bg-[#121212]'} ${step < s.id ? 'opacity-40' : ''}`}
              >
                <span className="text-[0.75rem] font-bold uppercase tracking-widest text-[#1a1c1c] dark:text-[#f9f9f9]">0{s.id}</span>
                <span className="text-xl md:text-2xl font-bold uppercase flex-grow ml-8 dark:text-[#f9f9f9]">{s.label}</span>
                <span className="text-[0.75rem] font-black uppercase text-[#1a1c1c] dark:text-[#f9f9f9]">
                  {step > s.id ? 'Completado' : step === s.id ? (
                    <span className="flex items-center gap-2 text-[#b1241a]">
                      EN CURSO <span className="w-2 h-2 bg-[#b1241a] rounded-full animate-dot-pulse"></span>
                    </span>
                  ) : 'Espera'}
                </span>
              </div>
            ))}
            <div className="border-t-2 border-[#1a1c1c] dark:border-[#f9f9f9]"></div>
          </div>

          <div className="hidden md:flex md:col-span-4 flex-col border-l-2 border-[#1a1c1c] dark:border-[#f9f9f9] pl-12 justify-between pb-6">
            <div className="flex-grow overflow-hidden mt-4">
              <p className="text-[0.65rem] font-black uppercase text-[#5a413d] dark:text-[#dcdddd] mb-4 tracking-[0.2em]">SYSTEM_LOG_STREAM</p>
              <div className="font-mono text-[10px] leading-relaxed opacity-70 dark:text-[#f9f9f9] flex flex-col-reverse h-[300px] overflow-y-auto scrollbar-hide">
                {logs.slice().reverse().map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <div className="mb-8">
                <p className="text-[0.75rem] font-bold uppercase text-[#5a413d] dark:text-[#dcdddd] mb-2">IDENTIFICADOR DE TAREA</p>
                <p className="text-xl font-black tracking-tight dark:text-[#f9f9f9]">DG-992-XPR</p>
              </div>
              <div>
                <p className="text-[0.75rem] font-bold uppercase text-[#5a413d] dark:text-[#dcdddd] mb-2">ESTADO DEL MOTOR</p>
                <p className="text-xl font-black tracking-tight text-[#b1241a]">RADICAL_SWISS_V3.1</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Processing;

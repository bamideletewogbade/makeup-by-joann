import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, RefreshCw, Wand2, Info, Check, Image as ImageIcon, Download, ArrowLeft, Heart } from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

const STYLES = [
  {
    id: 'sahara',
    label: 'Royal Sahara Radiance',
    desc: 'Metallic gold highlights, warm bronze sculpt contours, and a chocolate satin lip.'
  },
  {
    id: 'paris',
    label: 'Parisian Luminous Glow',
    desc: 'Dewy peptide reflections, soft rose cheeks, and a fresh specular look.'
  },
  {
    id: 'velvet',
    label: 'Velvet Crimson Lip',
    desc: 'Sharp graphic borders, almond eye wings, and deep crimson lipstick.'
  },
  {
    id: 'sunset',
    label: 'Sunset Ochre Glam',
    desc: 'Warm terracotta eyeshadow, amber highlights, and a high gloss nude lip.'
  }
];

const MOCK_MODELS = [
  {
    id: 'model_1',
    label: 'Model Portrait A',
    url: 'https://images.unsplash.com/photo-1503249023995-51b0f3778ccf?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'model_2',
    label: 'Model Portrait B',
    url: 'https://images.unsplash.com/photo-1500840216050-6ffa99d7cd76?q=80&w=600&auto=format&fit=crop'
  }
];

export default function VirtualTryOn() {
  const [selfie, setSelfie] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setCameraActive(true);
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError(true);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelfie(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectModel = (url: string) => {
    setSelfie(url);
  };

  const handleSimulate = async () => {
    if (!selfie || loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/virtual-try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selfie,
          styleLabel: selectedStyle.label,
          styleDescription: selectedStyle.desc
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Simulation failed");
      }

      const data = await response.json();
      if (data.success && data.imageUrl) {
        setResultImage(data.imageUrl);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while generating makeup simulation.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelfie(null);
    setResultImage(null);
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative overflow-hidden">
      <CursorGlow color="rgba(212, 163, 115, 0.1)" size={500} opacity={0.7} zIndex={0} particles />
      <div className="w-full px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-primary uppercase tracking-widest text-xs font-semibold font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" /> Visual Artistry Simulator
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium tracking-tight">
            AI Makeup <span className="italic font-serif text-primary">Try-On</span>
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto my-2"></div>
          <p className="text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Take a selfie or select a model portrait, pick a custom luxury look, and preview it applied to your face in real-time.
          </p>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Panel: Camera/Selfie Viewport (7-cols) */}
          <div className="lg:col-span-7 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[460px]">
            
            <div className="space-y-1 mb-4">
              <span className="text-[9px] bg-primary/20 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                Stage 01 // Input Capture
              </span>
              <h3 className="text-lg font-medium text-[#FAF7F2]">Selfie Viewport</h3>
              <p className="text-xs text-zinc-500 font-light">
                Use your webcam, upload a file, or click a model thumbnail below to pre-load a portrait.
              </p>
            </div>

            {/* Viewport Canvas Screen */}
            <div className="relative aspect-square sm:h-[380px] bg-black/60 rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-center">
              
              <AnimatePresence mode="wait">
                {resultImage ? (
                  <motion.div
                    key="tryon-result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img src={resultImage} alt="Try-On Look" className="w-full h-full object-cover" />
                    <span className="absolute bottom-4 left-4 bg-primary text-black text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded shadow">
                      AESTHETICS APPLIED
                    </span>
                  </motion.div>
                ) : selfie ? (
                  <motion.div
                    key="selfie-loaded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img src={selfie} alt="Original selfie" className="w-full h-full object-cover" />
                    <span className="absolute bottom-4 left-4 bg-black/80 text-[#FAF7F2] border border-white/10 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded shadow">
                      ORIGINAL PORTRAIT
                    </span>
                  </motion.div>
                ) : cameraActive ? (
                  <motion.div
                    key="camera-stream"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:bg-primary/90"
                    >
                      <Camera className="h-4 w-4" /> Capture Selfie
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-6 space-y-4 max-w-xs mx-auto z-10"
                  >
                    <ImageIcon className="h-10 w-10 text-zinc-600 mx-auto animate-pulse" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider">No Portrait Selected</h4>
                    <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                      Upload a front-facing selfie or enable your camera in a well-lit environment for optimal results.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loader */}
              {loading && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-30">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">Synthesizing Makeup...</p>
                  <p className="text-[10px] text-zinc-500 font-light max-w-[180px] text-center leading-relaxed">
                    Gemini model editing your face contours with luxury pigment layers.
                  </p>
                </div>
              )}

            </div>

            {/* Quick selectors & reset */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {!cameraActive && !selfie && (
                  <button
                    onClick={startCamera}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="h-4 w-4 text-primary" /> Webcam
                  </button>
                )}
                {cameraActive && (
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Stop Camera
                  </button>
                )}
                {!selfie && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="h-4 w-4 text-primary" /> Upload File
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {selfie && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-black/40 hover:bg-black text-xs text-zinc-400 hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer"
                >
                  Clear Portrait
                </button>
              )}
            </div>

            {/* Model Presets */}
            {!selfie && !cameraActive && (
              <div className="border-t border-white/5 pt-4 mt-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold mb-2">Or Use Model Presets</p>
                <div className="flex gap-3">
                  {MOCK_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => selectModel(model.url)}
                      className="group flex items-center gap-2 bg-black/40 border border-white/10 hover:border-primary/40 p-1.5 pr-3 rounded-xl transition-all text-left cursor-pointer"
                    >
                      <img src={model.url} alt={model.label} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-[10px] text-zinc-400 group-hover:text-white transition-colors">{model.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Panel: Style Selector & Execution (5-cols) */}
          <div className="lg:col-span-5 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[460px]">
            
            <div className="space-y-1">
              <span className="text-[9px] bg-primary/20 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                Stage 02 // Styling Filter
              </span>
              <h3 className="text-lg font-medium text-[#FAF7F2]">Select Makeup Vibe</h3>
              <p className="text-xs text-zinc-500 font-light">
                Pick a signature aesthetic below to apply to the loaded image.
              </p>
            </div>

            {/* Style list */}
            <div className="space-y-3.5 my-6">
              {STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => {
                    setSelectedStyle(style);
                    setResultImage(null); // Clear previous result to allow new try-on
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    selectedStyle.id === style.id
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <h4 className="text-xs uppercase tracking-wider font-bold">{style.label}</h4>
                  <p className="text-[10px] text-zinc-500 font-light mt-1.5 leading-relaxed">
                    {style.desc}
                  </p>
                  {selectedStyle.id === style.id && (
                    <div className="absolute top-3 right-4 text-primary font-mono text-[10px]">
                      ✦
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Run synthesis button */}
            <div className="space-y-3">
              <button
                onClick={handleSimulate}
                disabled={!selfie || loading}
                className="w-full py-4 bg-primary hover:bg-primary/95 disabled:opacity-50 text-black font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Wand2 className="h-4 w-4" /> Simulate Makeup Look
              </button>

              {resultImage && (
                <a
                  href={resultImage}
                  download={`${selectedStyle.id}-tryon.png`}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-[#FAF7F2] border border-white/10 font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4 text-primary" /> Download Portrait Result
                </a>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

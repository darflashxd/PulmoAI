import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import trashIcon from '../assets/trash-icon.svg'; 

// Ambil URL dari Environment Variable (VULN-007)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Konfigurasi Limitasi
const MAX_FILE_SIZE_MB = 10; // Sesuaikan dengan Backend (10MB)
const MAX_ATTEMPTS = 5; // Maksimal 5 kali upload
const COOLDOWN_TIME = 60000; // Hukuman 1 menit (60.000 ms) jika spam

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // State untuk Rate Limiting Frontend
  const [attempts, setAttempts] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset rate limit setelah cooldown selesai
  useEffect(() => {
    let timer: number;
    if (isRateLimited) {
      timer = setTimeout(() => {
        setIsRateLimited(false);
        setAttempts(0);
      }, COOLDOWN_TIME);
    }
    return () => clearTimeout(timer);
  }, [isRateLimited]);
  
  const handleDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // VULN-009: Validasi Input Frontend yang Lebih Ketat
  const handleFileProcess = (selectedFile: File) => {
    // 1. Cek Tipe File
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      alert("Format file tidak didukung! Harap gunakan JPG atau PNG.");
      return;
    }

    // 2. Cek Ukuran File (VULN-011 Mitigation di sisi Client)
    const fileSizeMB = selectedFile.size / 1024 / 1024;
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      alert(`File terlalu besar! Maksimal ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    // LOGIC RATE LIMITING (Anti DDoS Sederhana)
    if (isRateLimited) {
      alert(`Terlalu banyak percobaan. Mohon tunggu 1 menit.`);
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setIsRateLimited(true);
      alert("Anda telah mencapai batas upload. Silakan tunggu sebentar.");
      return;
    }

    setAttempts(prev => prev + 1); // Tambah counter attempt
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Gunakan URL dari Env Variable
      const response = await axios.post(`${API_BASE_URL}/predict`, formData);
      setResult(response.data);
    } catch (error: any) {
      console.error(error);
      // Tampilkan pesan error yang aman (jangan dump raw error)
      const msg = error.response?.data?.error || "Gagal terhubung ke server.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="w-full xl:min-h-[88vh] flex flex-col flex-grow bg-gradient-to-r from-[#58C8FF] to-[#27FE89] px-12 xl:py-28 items-center justify-center">
      <div className="w-full max-w-lg md:max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-8 pb-11 md:px-12 md:pt-10 md:pb-14">        
        
        <div className="flex flex-col justify-center items-center text-white gap-1 mt-2 mb-6 xl:mb-4 ">
            <h2 className="font-bold text-center text-2xl md:text-4xl">
              Scan Your Lungs
            </h2>
            <p className="text-xs md:text-lg">
              Upload your chest x-ray result
            </p>
        </div>
        
        {!preview ? (
          <form 
            className="relative"
            onDragEnter={handleDrag} 
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleChange}
            />

            {/* --- UPLOAD AREA --- */}
            <div 
              onClick={() => !isRateLimited && inputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-2xl transition-all duration-200 
                ${isRateLimited ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                ${dragActive 
                  ? "border-white bg-white/40 scale-[1.02]"
                  : "border-white/50 bg-white/10 hover:bg-white/20 hover:border-white"} 
              `}
            > 
              <div className="mb-4 text-white pointer-events-none">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              
              <p className="text-sm md:text-lg font-semibold text-white mb-1 pointer-events-none">
                {isRateLimited ? "Please wait a moment..." : "Choose a file or drag & drop it here."}
              </p>
              <p className="text-xs md:text-base text-white/70 mb-4 pointer-events-none">
                .jpg, .png, or .jpeg formats only. Max {MAX_FILE_SIZE_MB}MB.
              </p>
            </div>
          </form>
        ) : (
          // --- PREVIEW ---
          <div className="flex flex-col items-center">
            <div className="relative h-52 md:h-80 xl:h-64 min-w-fit max-w-full rounded-3xl md:rounded-[2rem] xl:rounded-3xl mb-6 md:mb-8 overflow-hidden shadow-md shadow-white/40 group">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              
              <button 
                onClick={resetScan}
                className="absolute top-4 right-4 md:top-7 md:right-6 xl:top-5 xl:right-4 transition-all hover:opacity-80"
                title="Delete Image"
              >
                <img 
                  src={trashIcon}
                  draggable="false" 
                  className="w-4 md:w-7 xl:w-6 object-contain animate-fade-in-up select-none" 
                />
              </button>
            </div>

            {/* --- UPLOAD BUTTON --- */}
            <button 
              onClick={handleUpload} 
              disabled={loading || isRateLimited}
              className={`px-4 py-2 md:py-3 md:px-7 rounded-full text-[#4D93FF] font-semibold text-base md:text-xl xl:text-lg shadow-lg transition-all hover:opacity-90
                ${loading || isRateLimited
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-white/95 hover:bg-gray-50 active:scale-95'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-[#4D93FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing...
                </span>
              ) : isRateLimited ? "Limit Reached" : "Start Scanning"}
            </button>
            
            {/* Pesan Peringatan Rate Limit */}
            {isRateLimited && (
              <p className="text-red-100 text-xs mt-2 font-medium bg-red-500/20 px-3 py-1 rounded-full">
                Too many attempts. Please wait 1 minute.
              </p>
            )}
          </div>
        )}

        {/* --- SCAN RESULT --- */}
        {result && (
          <div className={`mt-8 p-6 rounded-2xl border-[1px] text-center animate-fade-in-up backdrop-blur-sm
            ${result.label === 'Tuberculosis' 
              ? 'border-[#1A3052]/20 text-[#1A3052] bg-white/40'
              : 'border-white/30 text-white bg-white/5'
            }`}
          >
            <p className="text-xs md:text-base font-semibold mb-1 md:mb-2">
              Diagnosis Result
            </p>

            <h2 className="text-2xl md:text-4xl xl:text-[2.75rem] font-extrabold md:mb-2">
              {result.label}
            </h2> 

            <div className={`inline-block px-4 py-1 rounded-full text-xs md:text-sm tracking-wide font-normal
              ${result.label === 'Tuberculosis' 
                ? 'text-[#1A3052]'
                : 'text-white'
              }`}
            >
              Confidence: {result.confidence}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
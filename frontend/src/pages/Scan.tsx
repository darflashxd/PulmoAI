import { useState } from 'react';
import axios from 'axios';

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload an image!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Gagal connect ke server backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Wrapper ini hanya untuk menengahkan kartu di area konten
    <div className="flex flex-col items-center justify-center p-6 w-full h-full">
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">🫁 PulmoAI</h1>
          <p className="text-gray-500 text-sm mt-2">Deteksi Dini Tuberkulosis via X-Ray</p>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload X-Ray Paru-paru</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer border border-gray-300 rounded-lg p-2 bg-gray-50"
          />
        </div>

        {/* PREVIEW GAMBAR */}
        {preview && (
          <div className="mb-6 flex justify-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="h-64 w-full object-cover rounded-lg shadow-md border border-gray-200" 
            />
          </div>
        )}

        {/* TOMBOL ANALISA */}
        <button 
          onClick={handleUpload} 
          disabled={loading || !file}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg transition-all duration-200 shadow-lg
            ${loading || !file 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-95'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menganalisa...
            </span>
          ) : "🔍 Analisa Sekarang"}
        </button>

        {/* HASIL PREDIKSI */}
        {result && (
          <div className={`mt-8 p-5 rounded-xl border-2 text-center animate-fade-in-up
            ${result.label === 'Tuberculosis' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wider mb-1">Hasil Diagnosa AI</p>
            <h2 className="text-3xl font-bold mb-2">{result.label}</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-white/50 font-mono text-sm font-bold border border-black/5">
              Akurasi: {result.confidence}
            </div>
          </div>
        )}

      </div>
      
      <p className="mt-8 text-gray-400 text-xs text-center max-w-xs">
        Disclaimer: Hasil ini adalah prediksi AI dan bukan pengganti diagnosis dokter profesional.
      </p>
    </div>
  );
}

import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-md border border-stone-100">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-stone-800 serif-font">舌象照片采集</h2>
        <p className="text-sm text-stone-500 mt-2">请确保光线明亮，自然伸出舌头</p>
      </div>

      <div 
        onClick={!isAnalyzing ? triggerUpload : undefined}
        className={`relative aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden touch-manipulation
          ${preview ? 'border-red-800/30 bg-stone-50' : 'border-stone-300 active:bg-red-50/40 hover:border-red-800'}
          ${isAnalyzing ? 'opacity-80 cursor-not-allowed' : ''}`}
      >
        {preview ? (
          <img src={preview} alt="舌象预览" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-stone-700 font-bold">点击开启摄像头</p>
            <p className="text-stone-400 text-xs mt-2 italic px-4">建议对着镜子或请他人协助拍摄</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="mt-4 text-white font-bold serif-font tracking-widest text-lg">AI 智能辨证中</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="user"
        className="hidden"
      />

      <div className="mt-8 space-y-3">
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest px-1">拍照要领</h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            "自然伸出舌头，舌面平铺，勿过度用力",
            "选择白天靠近窗户的自然光，避免色偏",
            "饭后或喝咖啡、喝茶后30分钟内不宜检测"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 text-[10px] flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
              <p className="text-xs text-stone-600 font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

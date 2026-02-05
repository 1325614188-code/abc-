
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import { analyzeTongueImage } from './services/geminiService';
import { TongueAnalysis, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<TongueAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageAnalysis = async (base64Image: string) => {
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const analysisData = await analyzeTongueImage(base64Image);
      setResult(analysisData);
      setAppState(AppState.RESULT);
      // 分析完成后自动滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "舌象分析失败，请确保照片清晰并重试。");
      setAppState(AppState.ERROR);
    }
  };

  const resetAnalysis = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf5]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        {appState === AppState.IDLE || appState === AppState.ANALYZING || appState === AppState.ERROR ? (
          <div className="space-y-8 md:space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-stone-800 serif-font leading-tight">
                AI 赋能<br className="md:hidden" />
                <span className="text-red-800 px-2">数字中医</span>
              </h2>
              <p className="text-sm md:text-base text-stone-500 max-w-md mx-auto leading-relaxed">
                上传一张舌头照片，获取基于传统中医理论的健康趋势分析与调理方案。
              </p>
            </div>
            
            <ImageUploader 
              onImageSelected={handleImageAnalysis} 
              isAnalyzing={appState === AppState.ANALYZING} 
            />

            {error && (
              <div className="max-w-xl mx-auto bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-head-shake">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold text-xs">!</span>
                </div>
                <p className="text-xs md:text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Steps Guide - Tablet/Desktop only or simplified for mobile */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-xl mx-auto">
              {['一拍', '二传', '三辨'].map((step, i) => (
                <div key={i} className="bg-white/50 p-2 md:p-4 rounded-xl text-center border border-stone-200/50">
                  <p className="text-red-800 font-bold text-xs md:text-sm serif-font">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          result && <AnalysisResult result={result} onReset={resetAnalysis} />
        )}
      </main>

      {/* Info Section - Only visible on start page */}
      {appState === AppState.IDLE && (
        <section className="bg-white border-t border-stone-200 py-10 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h3 className="text-lg md:text-2xl font-bold text-stone-800 serif-font text-center mb-8">
              为什么看舌象？
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { title: "脾胃之窗", desc: "舌苔的变化能直接反映消化系统的运行状态。" },
                { title: "气血晴雨表", desc: "舌质的颜色深浅揭示了体内血液循环与能量储备。" },
                { title: "湿热指示灯", desc: "舌体的胖瘦与齿痕是体内水分代谢的重要信号。" }
              ].map((item, i) => (
                <div key={i} className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-800 text-sm mb-2 flex items-center gap-2">
                    <span className="w-1 h-3 bg-red-800 rounded-full"></span>
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-stone-50 border-t border-stone-100 py-8 px-4 text-center">
        <div className="max-w-xs mx-auto space-y-2">
           <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">TCM Tongue AI Assistant</p>
           <p className="text-stone-400 text-[10px] leading-relaxed">让传承千年的中医智慧<br/>通过科技触手可及</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

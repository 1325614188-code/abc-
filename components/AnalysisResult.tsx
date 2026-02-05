
import React from 'react';
import { TongueAnalysis } from '../types';

interface AnalysisResultProps {
  result: TongueAnalysis;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 md:space-y-8 pb-10">
      {/* Overview Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 shadow-stone-900/5">
        <div className="bg-red-800 px-5 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold serif-font flex items-center gap-2">
            <span className="text-lg">诊断报告</span>
          </h2>
          <button 
            onClick={onReset}
            className="text-white text-xs font-bold bg-white/20 px-4 py-2 rounded-full active:bg-white/30 transition-colors"
          >
            重新检测
          </button>
        </div>

        <div className="p-5 md:p-8">
          <div className="space-y-6">
            <div className="text-center md:text-left border-b border-stone-100 pb-6">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">中医体质辨证</span>
              <p className="text-3xl font-bold text-red-900 serif-font mt-2 leading-tight">{result.overallCondition}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <p className="text-xs text-stone-500 font-bold uppercase">舌质表现</p>
                </div>
                <p className="text-stone-800 font-bold">{result.tongueColor}、{result.tongueShape}</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <p className="text-xs text-stone-500 font-bold uppercase">舌苔表现</p>
                </div>
                <p className="text-stone-800 font-bold">{result.coatingColor}、{result.coatingTexture}</p>
              </div>
            </div>

            <div className="bg-red-50/30 p-5 rounded-2xl border border-red-100/50">
              <h3 className="text-sm font-bold text-red-900 serif-font mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                病机解析
              </h3>
              <p className="text-stone-700 leading-relaxed text-sm whitespace-pre-line">{result.tcmAnalysis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diet */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="text-md font-bold text-emerald-800 serif-font flex items-center gap-2 mb-4">
            <span className="p-1.5 bg-emerald-50 rounded-lg">🥬</span>
            食疗方案
          </h3>
          <ul className="space-y-4">
            {result.healthSuggestions.diet.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-700 text-sm">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></div>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
          {result.healthSuggestions.herbalReference && (
            <div className="mt-6 pt-4 border-t border-stone-50">
              <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">专家推荐：</p>
              <div className="bg-emerald-50/50 p-3 rounded-xl text-xs text-emerald-800 font-medium">
                {result.healthSuggestions.herbalReference}
              </div>
            </div>
          )}
        </div>

        {/* Lifestyle */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <h3 className="text-md font-bold text-amber-800 serif-font flex items-center gap-2 mb-4">
            <span className="p-1.5 bg-amber-50 rounded-lg">🧘</span>
            调摄建议
          </h3>
          <ul className="space-y-4">
            {result.healthSuggestions.lifestyle.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-700 text-sm">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Warnings */}
      <div className="bg-stone-100/80 rounded-2xl p-5 border border-stone-200/50">
        {result.warnings.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-red-800 flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              健康提醒
            </h4>
            <div className="space-y-2">
              {result.warnings.map((w, i) => (
                <div key={i} className="bg-white/50 p-2 px-3 rounded-lg text-[11px] text-red-700 border border-red-100/50">
                  {w}
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-[10px] text-stone-400 text-center leading-relaxed font-medium">
          免责声明：本工具利用人工智能技术模拟中医辨证逻辑，生成结果仅供学习参考。中医讲究“四诊合参”，单一舌象不能作为临床诊断依据。如感不适，请咨询线下执业医师。
        </p>
      </div>
    </div>
  );
};

export default AnalysisResult;


import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { TongueAnalysis } from "../types";

const TCM_SYSTEM_INSTRUCTION = `你是一位拥有30年临床经验的高级中医师，精通中医舌诊。
你的任务是通过用户上传的舌头照片，进行专业的舌象分析。
分析应包括：
1. 舌质（颜色、形状、神气）：如淡白、红、绛、紫；胖大、瘦薄、齿痕、裂纹等。
2. 舌苔（苔色、苔质）：如白苔、黄苔；薄、厚、腻、腐、剥等。
3. 综合中医辨证：如脾胃虚寒、心火旺盛、湿热内蕴等。
4. 生活建议：包括饮食禁忌、作息调整、经穴按摩建议。

注意：必须以JSON格式返回结果。请务必客观、严谨，并附带医疗免责声明，告知用户AI结果仅供参考，不作为确诊依据。`;

export const analyzeTongueImage = async (base64Image: string): Promise<TongueAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "请分析这张舌头照片，并按照约定的JSON格式输出中医诊断结果。",
        },
      ],
    },
    config: {
      systemInstruction: TCM_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tongueColor: { type: Type.STRING, description: "舌质颜色描述" },
          tongueShape: { type: Type.STRING, description: "舌体形状描述" },
          coatingColor: { type: Type.STRING, description: "舌苔颜色描述" },
          coatingTexture: { type: Type.STRING, description: "舌苔质地描述" },
          overallCondition: { type: Type.STRING, description: "总体中医体质判断" },
          tcmAnalysis: { type: Type.STRING, description: "详细的中医理论分析过程" },
          healthSuggestions: {
            type: Type.OBJECT,
            properties: {
              diet: { type: Type.ARRAY, items: { type: Type.STRING }, description: "建议饮食" },
              lifestyle: { type: Type.ARRAY, items: { type: Type.STRING }, description: "生活习惯建议" },
              herbalReference: { type: Type.STRING, description: "食疗或非处方草本参考（可选）" }
            },
            required: ["diet", "lifestyle"]
          },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "健康警示" }
        },
        required: ["tongueColor", "tongueShape", "coatingColor", "coatingTexture", "overallCondition", "tcmAnalysis", "healthSuggestions", "warnings"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("无法获取分析结果");
  
  return JSON.parse(text) as TongueAnalysis;
};

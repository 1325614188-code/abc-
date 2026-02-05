
import { GoogleGenAI, Type } from "@google/genai";
import { TongueAnalysis } from "../types";

const TCM_SYSTEM_INSTRUCTION = `你是一位拥有30年临床经验的高级中医师，精通中医舌诊。
你的任务是通过用户上传的舌头照片，进行专业的舌象分析。
分析应包括：
1. 舌质（颜色、形状、神气）：如淡白、红、绛、紫；胖大、瘦薄、齿痕、裂纹等。
2. 舌苔（苔色、苔质）：如白苔、黄苔；薄、厚、腻、腐、剥等。
3. 综合中医辨证：如脾胃虚寒、心火旺盛、湿热内蕴等。
4. 生活建议：包括饮食禁忌、作息调整、经穴按摩建议。

注意：必须以JSON格式返回结果。请务必客观、严谨，并附带医疗免责声明，告知用户AI结果仅供参考，不作为确诊依据。`;

// 获取 API Key 列表
const getApiKeys = (): string[] => {
  const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  return keysStr.split(',').map(k => k.trim()).filter(k => k.length > 0);
};

// 当前使用的 Key 索引
let currentKeyIndex = 0;

export const analyzeTongueImage = async (base64Image: string): Promise<TongueAnalysis> => {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    throw new Error("请在环境变量中配置 GEMINI_API_KEYS (多个 Key 用逗号分隔)");
  }

  let lastError: any = null;
  const maxRetries = Math.max(apiKeys.length * 2, 3); // 至少重试3次，或者按 Key 数量翻倍

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = apiKeys[currentKeyIndex];
    const genAI = new GoogleGenAI(apiKey);

    try {
      // 使用更稳定的 gemini-1.5-flash 模型
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: TCM_SYSTEM_INSTRUCTION,
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              },
              {
                text: "请分析这张舌头照片，并按照约定的JSON格式输出中医诊断结果。",
              },
            ],
          },
        ],
        generationConfig: {
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
          } as any
        }
      });

      const response = await result.response;
      const text = response.text();
      if (!text) throw new Error("无法获取分析结果");

      return JSON.parse(text) as TongueAnalysis;
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message?.toLowerCase() || "";

      // 如果是 503 (Overloaded) 或 429 (Rate Limit) 或包含相关关键词，则尝试轮换 Key
      if (
        errorMessage.includes("503") ||
        errorMessage.includes("overloaded") ||
        errorMessage.includes("429") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("unavailable")
      ) {
        console.warn(`API Key 索引 ${currentKeyIndex} 请求失败 (错误: ${error.message})，正在尝试轮换下一个 Key...`);
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

        // 指数退避式重试延迟（可选）
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }

      // 其他类型的错误（如认证错误、参数错误）则直接抛出
      throw error;
    }
  }

  throw lastError || new Error("所有重试尝试均已失败");
};

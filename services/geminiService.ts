
import { TongueAnalysis } from "../types";

/**
 * 分析舌头照片
 * 现在改由调用 Vercel 后端 API 路由，以保证 API Key 安全并解决浏览器环境限制。
 */
export const analyzeTongueImage = async (base64Image: string): Promise<TongueAnalysis> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `请求失败 (${response.status})`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};

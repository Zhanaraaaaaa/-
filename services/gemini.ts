
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAILifelineResponse = async (question: Question, lifelineType: 'phone' | 'audience'): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = lifelineType === 'phone' 
    ? `Дос ретінде телефон арқылы жауап беріңіз. Ойын: 'Миллион кімге бұйырады?'. Сұрақ: '${question.text}'. Нұсқалар: A) ${question.options[0]}, B) ${question.options[1]}, C) ${question.options[2]}, D) ${question.options[3]}. Дұрыс жауапты таңдап, қысқаша түсіндір (максимум 2 сөйлем). Қазақ тілінде жауап бер.`
    : `Көрермендердің дауыс беру нәтижесін пайыздармен көрсет. Сұрақ: '${question.text}'. Нұсқалар: A, B, C, D. Дұрыс жауап: ${question.options[question.answerIndex]}. Пайыздарды дұрыс жауапқа көбірек беретіндей етіп форматта: 'A: 10%, B: 70%, ...'. Тек пайыздарды көрсет. Қазақ тілінде.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Кешіріңіз, байланыс үзілді...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Техникалық ақаулық орын алды.";
  }
};

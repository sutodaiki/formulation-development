import { GoogleGenAI, Type } from "@google/genai";
import type { FormulationInput, Formulation } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (input: FormulationInput): string => {
  const {
    productName,
    concept,
    productType,
    skinTypes,
    effects,
    includeIngredients,
    excludeIngredients,
    texture,
  } = input;

  return `
以下の要件に基づいて、革新的で安定した化粧品の処方を提案してください。

製品名: ${productName}
製品コンセプト: ${concept}
製品タイプ: ${productType}
対象肌質: ${skinTypes.join(', ')}
期待される効果: ${effects.join(', ')}
配合したい主要成分: ${includeIngredients || '特になし'}
配合したくない成分: ${excludeIngredients || '特になし'}
テクスチャの希望: ${texture}

処方は、成分の役割、配合目的、製造手順を含めて、専門家が理解できるレベルで詳細に記述してください。
JSON形式で出力してください。
`;
};

const formulationSchema = {
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING, description: '生成された処方の製品名' },
        productType: { type: Type.STRING, description: '製品のカテゴリ (例: 美容液, クリーム)' },
        concept: { type: Type.STRING, description: '製品のコンセプトやキャッチコピー' },
        suitability: { type: Type.STRING, description: '製品が適している肌質や得られる効果の概要' },
        phases: {
            type: Type.ARRAY,
            description: '製造工程の各相（水相、油相など）',
            items: {
                type: Type.OBJECT,
                properties: {
                    phaseName: { type: Type.STRING, description: '相の名前 (例: A. 水相)' },
                    ingredients: {
                        type: Type.ARRAY,
                        description: 'その相に含まれる成分のリスト',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: '成分名' },
                                percentage: { type: Type.NUMBER, description: '配合率 (%)' },
                                role: { type: Type.STRING, description: '成分の役割 (例: 保湿剤, 乳化剤)' },
                            },
                             required: ['name', 'percentage', 'role']
                        },
                    },
                },
                 required: ['phaseName', 'ingredients']
            },
        },
        instructions: {
            type: Type.ARRAY,
            description: '製造手順のステップバイステップガイド',
            items: { type: Type.STRING },
        },
        notes: {
            type: Type.STRING,
            description: '防腐、安定性、pH調整、使用感に関する追加の注意点'
        },
    },
    required: ['productName', 'productType', 'concept', 'suitability', 'phases', 'instructions', 'notes'],
};


export const generateFormulation = async (input: FormulationInput): Promise<Formulation> => {
  const prompt = buildPrompt(input);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: formulationSchema,
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    const jsonText = response.text.trim();
    // Sometimes the response might be wrapped in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const data: Formulation = JSON.parse(cleanedJsonText);
    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Gemini APIからの処方生成に失敗しました。');
  }
};
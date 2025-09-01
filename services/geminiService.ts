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
    featuredIngredients,
    includeIngredients,
    excludeIngredients,
    texture,
  } = input;

  return `
あなたは化粧品OEM企業の経験豊富な処方開発担当者です。クライアントからの以下の要望に基づき、革新的で安定性が高く、製造可能な化粧品の処方を提案してください。

# クライアントの要望
- 製品名: ${productName}
- 製品コンセプト: ${concept}
- 製品タイプ: ${productType}
- 対象肌質: ${skinTypes.join(', ')}
- 期待される効果: ${effects.join(', ')}
- 弊社からの注目原料の利用希望: ${featuredIngredients.join(', ') || '特になし'}
- その他、配合したい成分: ${includeIngredients || '特になし'}
- 配合したくない成分: ${excludeIngredients || '特になし'}
- テクスチャの希望: ${texture}

# 提案に含めるべき項目
1.  **処方詳細**: 各成分の配合率(%)と役割を明確にした、水相・油相などのフェーズごとの処方。合計が100%になるように構成してください。
2.  **製造手順**: 専門家が理解できるレベルの詳細な製造工程。
3.  **概算コスト**: この処方を製造した場合の、製品1個あたりの参考価格帯を文字列で提示してください。(例: "約500円〜800円/個")
4.  **最小発注ロット(MOQ)**: この処方を弊社で製造する場合の、最小発注ロットを文字列で提示してください。(例: "3,000個から")
5.  **注記事項**: 防腐設計、安定性、pH調整などに関する専門的な補足事項。

提案は、クライアントがすぐにでも製品開発を進めたいと思えるような、魅力的かつ具体的な内容にしてください。
必ずJSON形式で出力してください。
`;
};

const formulationSchema = {
    type: Type.OBJECT,
    properties: {
        productName: { type: Type.STRING, description: '生成された処方の製品名' },
        productType: { type: Type.STRING, description: '製品のカテゴリ (例: 美容液, クリーム)' },
        concept: { type: Type.STRING, description: '製品のコンセプトやキャッチコピー' },
        suitability: { type: Type.STRING, description: '製品が適している肌質や得られる効果の概要' },
        estimatedCost: { type: Type.STRING, description: '製品1個あたりの概算製造コスト (例: "¥500〜¥800 / 100g")' },
        moq: { type: Type.STRING, description: '最小発注ロット (例: "3,000個から")' },
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
    required: ['productName', 'productType', 'concept', 'suitability', 'estimatedCost', 'moq', 'phases', 'instructions', 'notes'],
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

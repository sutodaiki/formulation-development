export type ProductType = '化粧水' | 'クリーム' | '美容液' | 'クレンザー' | '日焼け止め';
export type SkinType = '脂性肌' | '乾燥肌' | '混合肌' | '敏感肌' | '普通肌';
export type Effect = '保湿' | 'エイジングケア' | '美白' | 'ニキビケア' | '鎮静' | 'UVカット';
export type Texture = 'さっぱり' | 'しっとり' | 'ジェル状' | 'ウォータリー';

export interface FormulationInput {
  productName: string;
  email: string;
  concept: string;
  productType: ProductType;
  skinTypes: SkinType[];
  effects: Effect[];
  featuredIngredients: string[];
  includeIngredients: string;
  excludeIngredients: string;
  texture: Texture;
}

export interface Ingredient {
  name: string;
  percentage: number;
  role: string;
}

export interface FormulationPhase {
  phaseName: string;
  ingredients: Ingredient[];
}

export interface Formulation {
  productName: string;
  productType: string;
  concept: string;
  suitability: string;
  estimatedCost: string; // 例: "¥500〜¥800 / 100g"
  moq: string; // 例: "3,000個から"
  phases: FormulationPhase[];
  instructions: string[];
  notes: string;
}

export type InquiryAction = '相談' | 'サンプル依頼' | '詳細見積もり';

export interface InquiryDetails {
  companyName: string;
  contactName: string;
  email: string;
  message: string;
}

// FIX: Add the missing SavedFormulation type, which was causing an error in SavedFormulationsList.tsx.
export interface SavedFormulation {
  id: string;
  createdAt: string;
  output: Formulation;
}

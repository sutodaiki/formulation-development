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
  phases: FormulationPhase[];
  instructions: string[];
  notes: string;
}
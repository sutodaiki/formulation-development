import React, { useState } from 'react';
import type { FormulationInput, ProductType, SkinType, Effect, Texture } from '../types';
import { BeakerIcon, MailIcon } from './icons';

interface FormulationFormProps {
  initialState: FormulationInput;
  onSubmit: (data: FormulationInput) => void;
  isLoading: boolean;
}

const productTypes: ProductType[] = ['化粧水', 'クリーム', '美容液', 'クレンザー', '日焼け止め'];
const skinTypes: SkinType[] = ['脂性肌', '乾燥肌', '混合肌', '敏感肌', '普通肌'];
const effects: Effect[] = ['保湿', 'エイジングケア', '美白', 'ニキビケア', '鎮静', 'UVカット'];
const textures: Texture[] = ['さっぱり', 'しっとり', 'ジェル状', 'ウォータリー'];

const CheckboxGroup = <T extends string,>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: T[];
  selected: T[];
  onChange: (value: T) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  </div>
);


const FormulationForm: React.FC<FormulationFormProps> = ({ initialState, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormulationInput>(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = <T extends string,>(field: keyof FormulationInput, value: T) => {
    setFormData((prev) => {
      const currentValues = prev[field] as T[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">処方開発リクエスト</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">製品名</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
          <div className="mt-1 relative rounded-md shadow-sm">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="concept" className="block text-sm font-medium text-gray-700">製品コンセプト</label>
          <textarea
            id="concept"
            name="concept"
            rows={3}
            value={formData.concept}
            onChange={handleInputChange}
            placeholder="製品の目的、ターゲット層、マーケティング上の特徴などを記述します。"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-gray-700">製品タイプ</label>
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        
        <CheckboxGroup
          label="対象肌質"
          options={skinTypes}
          selected={formData.skinTypes}
          onChange={(value) => handleCheckboxChange('skinTypes', value)}
        />
        
        <CheckboxGroup
          label="期待される効果"
          options={effects}
          selected={formData.effects}
          onChange={(value) => handleCheckboxChange('effects', value)}
        />

        <div>
          <label htmlFor="texture" className="block text-sm font-medium text-gray-700">テクスチャ</label>
          <select
            id="texture"
            name="texture"
            value={formData.texture}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          >
            {textures.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="includeIngredients" className="block text-sm font-medium text-gray-700">配合したい成分 (カンマ区切り)</label>
          <textarea
            id="includeIngredients"
            name="includeIngredients"
            rows={2}
            value={formData.includeIngredients}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="excludeIngredients" className="block text-sm font-medium text-gray-700">配合したくない成分 (カンマ区切り)</label>
          <textarea
            id="excludeIngredients"
            name="excludeIngredients"
            rows={2}
            value={formData.excludeIngredients}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <BeakerIcon />
          {isLoading ? '生成中...' : '処方を生成'}
        </button>
      </form>
    </div>
  );
};

export default FormulationForm;
import React, { useState, useCallback } from 'react';
import { FormulationInput, Formulation } from './types';
import { generateFormulation } from './services/geminiService';
import FormulationForm from './components/FormulationForm';
import FormulationDisplay from './components/FormulationDisplay';
import Header from './components/Header';
import Loader from './components/Loader';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [formulationInput, setFormulationInput] = useState<FormulationInput>({
    productName: 'エイジングケア美容液',
    email: '',
    concept: '最先端のペプチド技術と自然由来の成分を融合させた、次世代のエイジングケア体験を提供する美容液。',
    productType: '美容液',
    skinTypes: ['乾燥肌', '普通肌'],
    effects: ['エイジングケア', '保湿'],
    includeIngredients: 'レチノール, ヒアルロン酸',
    excludeIngredients: 'パラベン, 鉱物油',
    texture: 'さっぱり',
  });

  const [generatedFormulation, setGeneratedFormulation] = useState<Formulation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (input: FormulationInput) => {
    setIsLoading(true);
    setError(null);
    setGeneratedFormulation(null);

    try {
      const result = await generateFormulation(input);
      setGeneratedFormulation(result);
    } catch (err) {
      console.error(err);
      setError('処方の生成中にエラーが発生しました。入力内容を確認し、再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <FormulationForm
              initialState={formulationInput}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 min-h-[600px] flex flex-col justify-center">
              {isLoading && <Loader />}
              {error && (
                <div className="text-center text-red-500">
                  <p className="text-lg font-semibold">エラー</p>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && !generatedFormulation && (
                <div className="text-center text-gray-500">
                  <p className="text-xl font-semibold mb-2">処方開発を開始します</p>
                  <p>左のフォームに必要な情報を入力し、「処方を生成」ボタンを押してください。</p>
                </div>
              )}
              {generatedFormulation && (
                <FormulationDisplay formulation={generatedFormulation} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
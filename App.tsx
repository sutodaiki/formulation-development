import React, { useState, useCallback } from 'react';
import { FormulationInput, Formulation, InquiryAction, InquiryDetails } from './types';
import { generateFormulation } from './services/geminiService';
import FormulationForm from './components/FormulationForm';
import FormulationDisplay from './components/FormulationDisplay';
import Header from './components/Header';
import Loader from './components/Loader';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';
import { CheckCircleIcon } from './components/icons';

const App: React.FC = () => {
  const [formulationInput, setFormulationInput] = useState<FormulationInput>({
    productName: 'エイジングケア美容液',
    email: '',
    concept: '最先端のペプチド技術と自然由来の成分を融合させた、次世代のエイジングケア体験を提供する美容液。',
    productType: '美容液',
    skinTypes: ['乾燥肌', '普通肌'],
    effects: ['エイジングケア', '保湿'],
    featuredIngredients: ['ヒト幹細胞順化培養液'],
    includeIngredients: 'レチノール, ヒアルロン酸',
    excludeIngredients: 'パラベン, 鉱物油',
    texture: 'さっぱり',
  });

  const [generatedFormulation, setGeneratedFormulation] = useState<Formulation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<InquiryAction | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);


  const handleFormSubmit = useCallback(async (input: FormulationInput) => {
    setIsLoading(true);
    setError(null);
    setGeneratedFormulation(null);
    setFormulationInput(input); // Keep track of the latest input for inquiry

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
  
  const handleOpenInquiryModal = useCallback((action: InquiryAction) => {
    setModalAction(action);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalAction(null);
  }, []);

  const handleInquirySubmit = useCallback(async (details: Omit<InquiryDetails, 'email'>) => {
    // In a real app, you would send this data to your backend API
    const fullInquiryDetails: InquiryDetails = {
        ...details,
        email: formulationInput.email,
    };
    console.log('--- INQUIRY SUBMITTED ---');
    console.log('Action:', modalAction);
    console.log('Details:', fullInquiryDetails);
    console.log('Formulation:', generatedFormulation);
    console.log('-------------------------');

    handleCloseModal();
    setInquirySuccess(true);
    setTimeout(() => {
        setInquirySuccess(false);
    }, 5000); // Hide success message after 5 seconds
  }, [formulationInput, generatedFormulation, modalAction, handleCloseModal]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
      <Header />
      
      {inquirySuccess && (
         <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-teal-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-down">
            <CheckCircleIcon className="w-6 h-6" />
            <span>お問い合わせありがとうございます。担当者よりご連絡いたします。</span>
        </div>
      )}

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
                <FormulationDisplay
                    formulation={generatedFormulation}
                    onInquiry={handleOpenInquiryModal}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {generatedFormulation && modalAction && (
        <InquiryModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleInquirySubmit}
            actionType={modalAction}
            formulationName={generatedFormulation.productName}
            email={formulationInput.email}
        />
      )}
    </div>
  );
};

export default App;
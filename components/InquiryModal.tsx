import React, { useState, useEffect } from 'react';
import type { InquiryAction, InquiryDetails } from '../types';
import { XIcon } from './icons';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: Omit<InquiryDetails, 'email'>) => void;
  actionType: InquiryAction;
  formulationName: string;
  email: string;
}

const actionTitles: Record<InquiryAction, string> = {
  '相談': 'ご相談フォーム',
  'サンプル依頼': 'サンプル作成依頼',
  '詳細見積もり': '詳細お見積もり依頼',
};

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, onSubmit, actionType, formulationName, email }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (isOpen) {
        setCompanyName('');
        setContactName('');
        setMessage(`製品名「${formulationName}」について、${actionType}を希望します。`);
    }
  }, [isOpen, actionType, formulationName]);


  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ companyName, contactName, message });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{actionTitles[actionType]}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <XIcon className="w-6 h-6" />
                <span className="sr-only">閉じる</span>
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">会社名</label>
                    <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">ご担当者名</label>
                    <input type="text" id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">ご連絡先メールアドレス</label>
                    <input type="email" id="email" value={email} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"/>
                </div>
                 <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">お問い合わせ内容</label>
                    <textarea id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"></textarea>
                </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end">
                <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                    送信する
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
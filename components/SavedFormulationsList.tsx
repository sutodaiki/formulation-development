import React from 'react';
import type { SavedFormulation } from '../types';
import { TrashIcon } from './icons';

interface SavedFormulationsListProps {
  formulations: SavedFormulation[];
  onSelect: (formulation: SavedFormulation) => void;
  onDelete: (id: string) => void;
  currentFormulationId: string | null;
}

const SavedFormulationsList: React.FC<SavedFormulationsListProps> = ({ formulations, onSelect, onDelete, currentFormulationId }) => {
  if (formulations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">保存した処方</h2>
      {formulations.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {formulations.map((f) => (
            <li
              key={f.id}
              className={`flex items-center justify-between p-3 transition-colors duration-150 ${
                currentFormulationId === f.id ? 'bg-teal-50' : 'hover:bg-gray-50'
              }`}
            >
              <div
                className="flex-grow cursor-pointer"
                onClick={() => onSelect(f)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && onSelect(f)}
                aria-label={`処方 ${f.output.productName} を表示`}
              >
                <p className="font-semibold text-teal-700">{f.output.productName}</p>
                <p className="text-sm text-gray-500">
                  保存日時: {new Date(f.createdAt).toLocaleString('ja-JP')}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(f.id);
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                aria-label={`処方 ${f.output.productName} を削除`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">保存された処方はありません。</p>
      )}
    </div>
  );
};

export default SavedFormulationsList;

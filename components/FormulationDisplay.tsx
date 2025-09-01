import React from 'react';
import type { Formulation, FormulationPhase, InquiryAction } from '../types';
import { DocumentTextIcon, LightBulbIcon, ClipboardListIcon, InformationCircleIcon, CurrencyYenIcon, CollectionIcon, ChatAltIcon, BeakerIcon, CalculatorIcon } from './icons';

interface FormulationDisplayProps {
  formulation: Formulation;
  onInquiry: (action: InquiryAction) => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="mb-8">
    <div className="flex items-center mb-4">
      <div className="text-teal-500 mr-3">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className="pl-8">{children}</div>
  </div>
);

const BusinessInfoCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
        <div className="text-teal-500 mr-4">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const PhaseTable: React.FC<{ phase: FormulationPhase }> = ({ phase }) => (
    <div className="mb-6 last:mb-0 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">{phase.phaseName}</h4>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 rounded-t-lg">
                    <tr>
                        <th scope="col" className="px-4 py-2">成分名</th>
                        <th scope="col" className="px-4 py-2 text-right">配合率 (%)</th>
                        <th scope="col" className="px-4 py-2">役割</th>
                    </tr>
                </thead>
                <tbody>
                    {phase.ingredients.map((ing, index) => (
                        <tr key={index} className="bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{ing.name}</td>
                            <td className="px-4 py-2 text-right">{ing.percentage.toFixed(2)}</td>
                            <td className="px-4 py-2">{ing.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ActionButton: React.FC<{
    action: InquiryAction;
    icon: React.ReactNode;
    onClick: (action: InquiryAction) => void;
    children: React.ReactNode;
}> = ({ action, icon, onClick, children }) => (
    <button
        onClick={() => onClick(action)}
        className="flex-1 flex flex-col items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
    >
        {icon}
        <span className="mt-1">{children}</span>
    </button>
);


const FormulationDisplay: React.FC<FormulationDisplayProps> = ({ formulation, onInquiry }) => {
  return (
    <div className="animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{formulation.productName}</h2>
            <p className="mt-2 text-lg text-teal-600 font-semibold">{formulation.productType}</p>
        </div>

      <SectionCard title="コンセプト" icon={<LightBulbIcon />}>
        <p className="text-gray-600 leading-relaxed">{formulation.concept}</p>
        <p className="mt-2 text-sm text-gray-500">{formulation.suitability}</p>
      </SectionCard>
      
      <div className="mb-8 pl-8">
        <div className="flex flex-col md:flex-row gap-4">
            <BusinessInfoCard label="概算コスト" value={formulation.estimatedCost} icon={<CurrencyYenIcon />} />
            <BusinessInfoCard label="最小発注ロット (MOQ)" value={formulation.moq} icon={<CollectionIcon />} />
        </div>
      </div>


      <SectionCard title="処方" icon={<DocumentTextIcon />}>
        {formulation.phases.map((phase, index) => (
          <PhaseTable key={index} phase={phase} />
        ))}
      </SectionCard>
      
      <SectionCard title="製造手順" icon={<ClipboardListIcon />}>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          {formulation.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard title="注記事項" icon={<InformationCircleIcon />}>
        <p className="text-gray-600 bg-blue-50 border border-blue-200 p-4 rounded-lg">{formulation.notes}</p>
      </SectionCard>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-center text-xl font-bold text-gray-800 mb-6">この処方で次のステップへ</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ActionButton action="相談" icon={<ChatAltIcon />} onClick={onInquiry}>
                この処方で相談する
            </ActionButton>
            <ActionButton action="サンプル依頼" icon={<BeakerIcon />} onClick={onInquiry}>
                サンプル作成を依頼
            </ActionButton>
            <ActionButton action="詳細見積もり" icon={<CalculatorIcon />} onClick={onInquiry}>
                詳細な見積もりを依頼
            </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default FormulationDisplay;

import React from 'react';
import type { Formulation, FormulationPhase } from '../types';
import { DocumentTextIcon, LightBulbIcon, ClipboardListIcon, InformationCircleIcon } from './icons';

interface FormulationDisplayProps {
  formulation: Formulation;
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

const FormulationDisplay: React.FC<FormulationDisplayProps> = ({ formulation }) => {
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
    </div>
  );
};

export default FormulationDisplay;

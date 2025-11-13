
import React from 'react';
import { SceneDescriptionResponse } from '../types';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, Volume2Icon, StopCircleIcon } from './Icons';

interface ResultDisplayProps {
  result: SceneDescriptionResponse;
  onSpeak: () => void;
  isSpeaking: boolean;
}

const PriorityIndicator: React.FC<{ priority: SceneDescriptionResponse['priority'] }> = ({ priority }) => {
    const baseClasses = "flex items-center text-lg font-bold px-4 py-2 rounded-t-lg";
    switch (priority) {
        case 'CAUTION':
        case 'HIGH':
        case 'MODERATE':
            return <div className={`${baseClasses} bg-yellow-800 text-yellow-100`}><AlertTriangleIcon className="h-5 w-5 mr-2" /> {priority}</div>;
        case 'SAFE':
            return <div className={`${baseClasses} bg-green-800 text-green-100`}><CheckCircleIcon className="h-5 w-5 mr-2" /> {priority}</div>;
        case 'INFO':
        case 'LOW':
        default:
            return <div className={`${baseClasses} bg-blue-800 text-blue-100`}><InfoIcon className="h-5 w-5 mr-2" /> {priority}</div>;
    }
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</h4>
    <p className="text-gray-200 mt-1">{value}</p>
  </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onSpeak, isSpeaking }) => {
  return (
    <div className="mt-6 animate-fade-in space-y-4">
        <div className="bg-gray-700/50 rounded-lg shadow-lg">
            <PriorityIndicator priority={result.priority} />
            <div className="p-4 space-y-4">
                {result.immediate_alert && (
                    <div className="bg-red-900/80 p-3 rounded-md">
                        <h3 className="font-bold text-red-200 text-lg">Immediate Alert</h3>
                        <p className="text-red-200">{result.immediate_alert}</p>
                    </div>
                )}
                
                <div>
                    <h3 className="font-bold text-xl text-white">{result.quick_summary}</h3>
                </div>

                <div className="border-t border-gray-600 pt-4">
                    <button onClick={onSpeak} className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors duration-200">
                        {isSpeaking ? <StopCircleIcon className="h-6 w-6 mr-2" /> : <Volume2Icon className="h-6 w-6 mr-2" />}
                        {isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
                    </button>
                    <p className="text-gray-300 mt-3 p-3 bg-gray-800 rounded-md italic">"{result.speech_output}"</p>
                </div>
            </div>
        </div>
      
        <div className="bg-gray-700/50 rounded-lg shadow-lg p-4 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-gray-600 pb-2">Detailed Description</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Setting" value={result.detailed_description.setting} />
                <DetailItem label="People" value={result.detailed_description.people} />
                <DetailItem label="Objects" value={result.detailed_description.objects} />
                <DetailItem label="Visible Text" value={result.detailed_description.text_visible} />
                <DetailItem label="Hazards" value={result.detailed_description.hazards} />
                <DetailItem label="Navigation" value={result.detailed_description.navigation} />
            </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg shadow-lg p-4 space-y-2">
            <h3 className="text-lg font-bold text-white">Spatial Layout & Guidance</h3>
             <DetailItem label="Layout" value={result.spatial_layout} />
             <DetailItem label="Actionable Guidance" value={result.actionable_guidance} />
        </div>
    </div>
  );
};

export default ResultDisplay;

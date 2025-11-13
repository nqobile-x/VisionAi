
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { analyzeImageForSceneDescription } from './services/geminiService';
import { SceneDescriptionResponse } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SceneDescriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    try {
      const result = await analyzeImageForSceneDescription(imageFile);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleSpeak = useCallback(() => {
    if (!analysisResult?.speech_output) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(analysisResult.speech_output);
      utteranceRef.current = utterance;
      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setError("An error occurred with the speech synthesis.");
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }, [analysisResult, isSpeaking]);

  useEffect(() => {
    return () => {
      // Cleanup speech synthesis on component unmount
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
          <ImageUploader
            onImageChange={handleImageChange}
            imageUrl={imageUrl}
            disabled={isLoading}
          />

          <div className="flex justify-center">
            <button
              onClick={handleAnalyzeClick}
              disabled={!imageFile || isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ml-3">Analyzing...</span>
                </>
              ) : (
                'Analyze Scene'
              )}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {analysisResult && (
            <ResultDisplay 
              result={analysisResult} 
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
            />
          )}
        </div>
        <footer className="text-center text-gray-500 mt-8 text-sm">
          <p>Powered by Gemini. Built for accessibility.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;

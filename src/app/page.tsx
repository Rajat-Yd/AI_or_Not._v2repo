'use client';

import { useState } from 'react';
import type { AnalyzeTextWithGeminiOutput } from '@/ai/flows/analyze-text-with-gemini';
import { AnalysisForm } from '@/components/analysis-form';
import { AnalysisResult } from '@/components/analysis-result';
import { AnalysisHistory } from '@/components/analysis-history';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { ShieldCheck } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  text: string;
  result: AnalyzeTextWithGeminiOutput;
}

export default function Home() {
  const [result, setResult] = useState<AnalyzeTextWithGeminiOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [viewingHistoryItem, setViewingHistoryItem] = useState<HistoryEntry | null>(null);


  const handleAnalysisComplete = (res: AnalyzeTextWithGeminiOutput | null, text: string) => {
    setResult(res);
    setIsLoading(false);
    if (res) {
      setHistory(prev => [{ id: new Date().toISOString(), result: res, text }, ...prev]);
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setShowResult(false);
    setViewingHistoryItem(null);
    // Allow animation to finish before clearing result
    setTimeout(() => {
      setResult(null);
    }, 300);
  };
  
  const handleViewHistoryItem = (item: HistoryEntry) => {
    setViewingHistoryItem(item);
    setResult(item.result);
    setShowResult(true);
  }

  const currentResult = viewingHistoryItem ? viewingHistoryItem.result : result;

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="w-full max-w-2xl py-8">
        <div className="flex justify-center mb-6 relative">
          <Logo />
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
        </div>
        
        <div className="transition-opacity duration-300 mb-8">
          {showResult && currentResult ? (
            <AnalysisResult result={currentResult} onReset={handleReset} />
          ) : (
            <AnalysisForm
              onAnalysisComplete={handleAnalysisComplete}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          )}
        </div>

        {history.length > 0 && !showResult && (
           <AnalysisHistory history={history} onView={handleViewHistoryItem} />
        )}
      </div>
      <footer className="mt-auto pt-8 pb-4 text-center text-sm text-muted-foreground">
        <div className="flex justify-center items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span>We don't store your data. Your privacy is respected.</span>
        </div>
        <p>&copy; {new Date().getFullYear()} AI or Not? All rights reserved.</p>
        <p className="mt-1">Powered by Google Gemini. AI detection is not always perfect.</p>
      </footer>
    </main>
  );
}

"use client";

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, User, RefreshCcw, Copy, FileDown } from "lucide-react";
import type { AnalyzeTextWithGeminiOutput } from '@/ai/flows/analyze-text-with-gemini';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisResultProps {
  result: AnalyzeTextWithGeminiOutput;
  onReset: () => void;
}

const CircularProgress = ({
  percentage,
  color,
  size = 160,
  strokeWidth = 12,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0" width={size} height={size}>
        <circle
          className="text-secondary"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-foreground">{percentage}
          <span className="text-2xl font-semibold text-muted-foreground">%</span>
        </span>
        <span className="text-xs font-medium text-muted-foreground">Confidence</span>
      </div>
    </div>
  );
};

export function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const confidencePercent = Math.round(result.confidence * 100);
  const isAI = result.isAiGenerated;
  
  const displayedConfidence = isAI ? confidencePercent : 100 - confidencePercent;
  const label = isAI ? "AI-Generated" : "Human-Written";
  const Icon = isAI ? Bot : User;
  
  const primaryColor = 'hsl(var(--primary))';
  const accentColor = 'hsl(var(--accent))';
  
  const color = isAI ? primaryColor : accentColor;
  const colorClass = isAI ? "text-primary" : "text-accent";

  const handleCopySummary = () => {
    const summaryText = `
Analysis Result: ${label}
Confidence: ${displayedConfidence}%
Reasoning: ${result.explanation}
    `.trim();

    navigator.clipboard.writeText(summaryText).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The analysis summary has been copied.",
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        variant: 'destructive',
        title: "Copy Failed",
        description: "Could not copy the summary. Please try again.",
      });
    });
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
    });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('ai-or-not-analysis.pdf');
  };

  return (
    <Card className="w-full animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
        <div ref={printRef} className="p-6 bg-card">
            <CardHeader className="items-center text-center pb-6 p-0">
              <CardTitle className="text-2xl font-bold">Analysis Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-0 pt-6">
              <div className="flex flex-col items-center gap-4">
                <CircularProgress percentage={displayedConfidence} color={color} />
                <div className={`flex items-center gap-2 text-2xl font-bold ${colorClass}`}>
                  <Icon className="w-7 h-7" />
                  <span>{label}</span>
                </div>
              </div>

              <Card className="bg-secondary/50 border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">AI's Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{result.explanation}</p>
                </CardContent>
              </Card>
            </CardContent>
        </div>
      <CardContent className="pt-6 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleCopySummary} variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Summary
          </Button>
          <Button onClick={handleDownloadPdf} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
        
        <Button onClick={onReset} className="w-full text-base py-6 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
          <RefreshCcw className="mr-2 h-5 w-5" />
          Analyze Another
        </Button>
      </CardContent>
    </Card>
  );
}
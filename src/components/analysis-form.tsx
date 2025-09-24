"use client";

import { useState, DragEvent, ChangeEvent } from "react";
import { performAnalysis, extractTextFromFile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, Wand2, Sparkles } from "lucide-react";
import type { AnalyzeTextWithGeminiOutput } from "@/ai/flows/analyze-text-with-gemini";

interface AnalysisFormProps {
  onAnalysisComplete: (result: AnalyzeTextWithGeminiOutput | null, text: string) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const sampleTexts = [
  "The sun dipped below the horizon, painting the sky in fiery hues of orange and red. A gentle breeze rustled through the leaves of the ancient oak tree, which stood as a silent sentinel on the hill. For generations, it had witnessed the comings and goings of the small village nestled in the valley below. I remember my grandfather telling me stories under its sprawling branches, his voice a low, comforting rumble as he spoke of times long past.",
  "Leveraging synergistic paradigms, our platform optimizes user-centric information flow through a bespoke, multi-layered architecture. We facilitate the seamless integration of cross-functional data streams, empowering stakeholders to action key performance indicators in real-time. Our solution is engineered for maximum scalability and granular customizability, ensuring a future-proof ecosystem for enterprise-level digital transformation.",
  "I'm not sure what to write here, honestly. This is supposed to be an example text for some kind of AI detector thing. I guess I should try to sound as human as possible? We went to the park yesterday, and my dog, Barnaby, chased a squirrel up a tree. He was so excited, barking and jumping around. It was pretty funny. He never catches them, but he never gives up trying, either. That's just how he is.",
  "The quantum computational matrix has demonstrated that by manipulating entangled qubits within a stabilized coherence field, it's possible to achieve exponential speed-up for specific algorithmic classes, such as integer factorization. The primary challenge remains decoherence, where quantum states collapse due to environmental interaction. Researchers are currently exploring topological quantum computing as a more robust alternative, which encodes information non-locally, thus protecting it from minor, localized perturbations.",
];

function getRandomSampleText() {
  const randomIndex = Math.floor(Math.random() * sampleTexts.length);
  return sampleTexts[randomIndex];
}

export function AnalysisForm({ onAnalysisComplete, setIsLoading, isLoading }: AnalysisFormProps) {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("paste");

  const handleAnalysis = async () => {
    setIsLoading(true);
    const originalText = text;
    const { result, error } = await performAnalysis(originalText);
    if (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error,
      });
      onAnalysisComplete(null, originalText);
    } else {
      onAnalysisComplete(result, originalText);
    }
    setIsLoading(false);
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
      e.dataTransfer.clearData();
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
      });
      return;
    }
    
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (readEvent) => {
        const buffer = readEvent.target?.result;
        if (buffer) {
            const { text: extractedText, error } = await extractTextFromFile(buffer as ArrayBuffer, file.type);
            if(error) {
                 toast({
                    variant: "destructive",
                    title: "Extraction Failed",
                    description: error,
                });
            } else if (extractedText) {
                setText(extractedText);
                toast({
                    title: "File loaded",
                    description: "Text from your file has been extracted. Click 'Analyze Text' to proceed.",
                });
                setActiveTab("paste");
            }
        }
        setIsLoading(false);
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the selected file.",
        });
        setIsLoading(false);
    }
    reader.readAsArrayBuffer(file);
  };

  const handleDragEvents = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleTryExample = () => {
    setText(getRandomSampleText());
  }

  return (
    <Card className="w-full animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">AI Content Detector</CardTitle>
        <CardDescription className="text-center">
          Paste text or upload a file to check if it's AI or human-written.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>
          <TabsContent value="paste" className="mt-4 space-y-4">
            <Textarea
              placeholder="Enter text here... (minimum 50 characters)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] text-base"
              disabled={isLoading}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button onClick={handleTryExample} variant="outline" disabled={isLoading}>
                <Sparkles className="mr-2 h-5 w-5" />
                Try Example
              </Button>
              <Button onClick={handleAnalysis} disabled={isLoading || text.trim().length < 50}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Analyze Text
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
             <div
              onDrop={handleFileDrop}
              onDragOver={handleDragEvents}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              className={`relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              } ${
                isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                 {isLoading ? (
                  <Loader2 className="w-10 h-10 mb-4 text-muted-foreground animate-spin" />
                ) : (
                  <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                )}
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">TXT, PDF, or DOCX (up to 10MB)</p>
              </div>
              <input id="file-upload" type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" disabled={isLoading} />
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground">After uploading a file, the extracted text will appear in the "Paste Text" tab.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

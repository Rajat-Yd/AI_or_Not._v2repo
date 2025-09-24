import { BrainCircuit } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3" aria-label="AI or Not?">
      <BrainCircuit className="h-9 w-9 text-primary" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        AI or Not?
      </h1>
    </div>
  );
}

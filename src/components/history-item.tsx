"use client";

import type { HistoryEntry } from "@/app/page";
import { Bot, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryItemProps {
  item: HistoryEntry;
  onView: (item: HistoryEntry) => void;
}

export function HistoryItem({ item, onView }: HistoryItemProps) {
  const { result, text } = item;
  const isAI = result.isAiGenerated;
  const confidencePercent = Math.round(result.confidence * 100);
  const displayedConfidence = isAI ? confidencePercent : 100 - confidencePercent;
  const label = isAI ? "AI-Generated" : "Human-Written";
  const Icon = isAI ? Bot : User;
  const colorClass = isAI ? "text-primary" : "text-accent";

  const snippet = text.length > 100 ? `${text.substring(0, 100)}...` : text;

  return (
    <div className="p-4 border rounded-lg bg-secondary/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1">
        <div className={`flex items-center gap-2 text-lg font-semibold ${colorClass}`}>
          <Icon className="w-5 h-5" />
          <span>{label} ({displayedConfidence}%)</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{snippet}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onView(item)}>
        <Eye className="mr-2 h-4 w-4" />
        View Details
      </Button>
    </div>
  );
}

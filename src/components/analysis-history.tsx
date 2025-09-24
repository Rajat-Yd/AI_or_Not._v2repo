"use client";

import type { HistoryEntry } from "@/app/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryItem } from "./history-item";

interface AnalysisHistoryProps {
  history: HistoryEntry[];
  onView: (item: HistoryEntry) => void;
}

export function AnalysisHistory({ history, onView }: AnalysisHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="w-full animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Recent Checks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item) => (
            <HistoryItem key={item.id} item={item} onView={onView} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

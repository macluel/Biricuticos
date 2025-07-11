import { useState } from "react";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

export function AdminPanel() {
  const { interactions } = usePlaceStats();
  const [showPanel, setShowPanel] = useState(false);

  const exportData = () => {
    const dataStr = JSON.stringify(interactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shared-interactions.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const dataStr = JSON.stringify(interactions, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert(
        "Data copied to clipboard! Replace the content of client/data/shared-interactions.json with this data.",
      );
    });
  };

  // Hidden admin panel - press Ctrl+Shift+A to show
  useState(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setShowPanel(!showPanel);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  });

  if (!showPanel) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50">
      <h3 className="text-sm font-bold mb-3">Admin Panel</h3>
      <div className="space-y-2">
        <Button size="sm" onClick={exportData} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download JSON
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
          className="w-full"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Current interactions: {interactions.length}
        </p>
        <p className="text-xs text-gray-400">Press Ctrl+Shift+A to hide</p>
      </div>
    </div>
  );
}

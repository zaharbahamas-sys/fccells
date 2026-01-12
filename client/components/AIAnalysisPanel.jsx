import React, { useState } from "react";
import { Bot, FileText, Send, AlertCircle, Check, Loader2 } from "lucide-react";

const AIAnalysisPanel = ({ siteData }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Configuration state
  const [config, setConfig] = useState({
    taskType: "analysis", // Options: analysis, email, action_plan
    language: "english", // Options: english, arabic
  });

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Merging siteData (props) with the selected configuration
      const payload = {
        ...siteData,
        taskType: config.taskType,
        language: config.language,
      };

      const response = await fetch("/api/python/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate analysis");
      }

      setResult(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto my-8">
      {/* Header Section */}
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              AI Power System Analyst
            </h2>
            <p className="text-sm text-slate-500">
              Powered by Gemini 2.0 Flash
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
        {/* Task Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Generation Task
          </label>
          <select
            value={config.taskType}
            onChange={(e) => setConfig({ ...config, taskType: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="analysis">Technical Engineering Analysis</option>
            <option value="email">Project Manager Email (ROI)</option>
            <option value="action_plan">Deployment Action Plan</option>
          </select>
        </div>

        {/* Language Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Output Language
          </label>
          <select
            value={config.language}
            onChange={(e) => setConfig({ ...config, language: e.target.value })}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="english">English (Technical)</option>
            <option value="arabic">Arabic (Standard)</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="flex items-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            {loading ? "Analyzing..." : "Generate Report"}
          </button>
        </div>
      </div>

      {/* Output / Result Area */}
      <div className="px-6 pb-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Analysis Failed</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-lg overflow-hidden animate-in fade-in duration-500">
            <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                Generated Content
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
              >
                Copy Text
              </button>
            </div>

            <div className="p-6 bg-white prose prose-slate max-w-none">
              {/* Preserving whitespace to handle basic markdown formatting from API */}
              <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                {result}
              </div>
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
            <Bot size={48} className="mx-auto mb-3 opacity-20" />
            <p>Select a task and click "Generate Report" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPanel;

import { useState, useCallback } from 'react';

const PYTHON_API_BASE = '/api/python';

type AITaskType = 'analysis' | 'email' | 'action_plan';
type AILanguage = 'english' | 'arabic';

interface AnalysisResult {
  success: boolean;
  analysis?: string;
  error?: string;
  recommendation?: string;
  model?: string;
  taskType?: AITaskType;
  language?: AILanguage;
}

interface AssetAnalysisResult {
  success: boolean;
  recommendation: string;
  action: string;
  analysis: string;
  metrics: {
    efficiency_loss: number;
    annual_waste_estimate: number;
  };
}

export function usePythonServices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${PYTHON_API_BASE}/health`);
      return await response.json();
    } catch (e) {
      return { status: 'unavailable', gemini_configured: false };
    }
  }, []);

  const analyzeSystem = useCallback(async (data: {
    load: number;
    autonomy: number;
    voltage: number;
    temperature: number;
    altitude: number;
    dgRated?: number;
    dgRunningHours?: number;
    dgAge?: number;
    fuelCellModel?: string;
    loadFactor?: number;
    dgDailyCost?: number;
    fcDailyCost?: number;
    dailySavings?: number;
    annualSavings?: number;
    co2Savings?: number;
    taskType?: AITaskType;
    language?: AILanguage;
  }): Promise<AnalysisResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      setIsLoading(false);
      
      if (result.success) {
        return {
          success: true,
          analysis: result.content,
          taskType: result.taskType,
          language: result.language,
        };
      }
      return result;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Analysis failed';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  }, []);

  const generatePDF = useCallback(async (data: {
    date: string;
    load: number;
    autonomy: number;
    voltage: number;
    temperature: number;
    altitude: number;
    fuelCell?: {
      model: string;
      manufacturer: string;
      ratedPower: number;
      efficiency: number;
    };
    results?: {
      fcStackRequired: number;
      batteryCapacity: number;
      batteryStrings: number;
      h2Cylinders: number;
      cableSize: number;
    };
    financial?: {
      dgTCO: number;
      fcTCO: number;
      annualSavings: number;
      paybackYears: number;
    };
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${PYTHON_API_BASE}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('PDF generation failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fcpms_sizing_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setIsLoading(false);
      return { success: true };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'PDF generation failed';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  }, []);

  const generateDiagram = useCallback(async (data: {
    type: 'system' | 'flow';
    load?: number;
    fcPower?: number;
    batteryCapacity?: number;
    h2Cylinders?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${PYTHON_API_BASE}/generate-diagram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Diagram generation failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'system_diagram.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setIsLoading(false);
      return { success: true };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Diagram generation failed';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  }, []);

  const analyzeAsset = useCallback(async (data: {
    loadFactor: number;
    age: number;
    ratedPower: number;
    runningHours: number;
  }): Promise<AssetAnalysisResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${PYTHON_API_BASE}/asset-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      setIsLoading(false);
      return result;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Asset analysis failed';
      setError(errorMsg);
      setIsLoading(false);
      return {
        success: false,
        recommendation: 'error',
        action: 'Analysis unavailable',
        analysis: errorMsg,
        metrics: { efficiency_loss: 0, annual_waste_estimate: 0 }
      };
    }
  }, []);

  const generateCSV = useCallback(async (data: {
    projectName?: string;
    load: number;
    autonomy: number;
    voltage: number;
    temperature: number;
    altitude: number;
    fuelCell?: {
      model: string;
      manufacturer: string;
      ratedPower: number;
      efficiency: number;
    };
    results?: {
      batteryCapacity: number;
      batteryStrings: number;
      h2Cylinders: number;
      cableSize: number;
    };
    financial?: {
      dgDailyCost: number;
      fcDailyCost: number;
      dailySavings: number;
      annualSavings: number;
      paybackYears: number;
      co2Savings: number;
    };
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${PYTHON_API_BASE}/generate-csv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('CSV generation failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fcpms_data_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setIsLoading(false);
      return { success: true };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'CSV generation failed';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  }, []);

  return {
    isLoading,
    error,
    checkHealth,
    analyzeSystem,
    generatePDF,
    generateCSV,
    generateDiagram,
    analyzeAsset
  };
}

export type { AITaskType, AILanguage };

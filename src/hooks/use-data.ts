import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { RawData, ColumnInfo } from '@/src/types';
import { detectColumnTypes } from '@/src/lib/data-utils';

export function useDataManagement() {
  const [data, setData] = useState<RawData[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const processData = useCallback((rawData: any[], name: string) => {
    const detectedTypes = detectColumnTypes(rawData);
    const cols: ColumnInfo[] = Object.entries(detectedTypes).map(([name, type]) => ({
      name,
      type
    }));
    
    setData(rawData);
    setColumns(cols);
    setFileName(name);
    setIsLoading(false);
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          processData(results.data, file.name);
        },
        error: (err) => {
          console.error(err);
          setIsLoading(false);
        }
      });
    } else if (file.name.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          processData(Array.isArray(json) ? json : [json], file.name);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    }
  }, [processData]);

  return {
    data,
    columns,
    isLoading,
    fileName,
    handleFileUpload,
    setData,
    setColumns
  };
}

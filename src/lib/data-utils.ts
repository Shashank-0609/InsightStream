import { RawData } from "@/src/types";

export function parseNumeric(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;
  // Remove currency symbols, commas, etc.
  const clean = String(val).replace(/[$,]/g, '').trim();
  const num = Number(clean);
  return isNaN(num) ? null : num;
}

export function getColumnStats(data: RawData[], column: string) {
  const values = data.map(d => parseNumeric(d[column])).filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return {
    name: column,
    avg,
    min,
    max,
    total: sum,
    count: values.length
  };
}

export function groupAndAggregateData(data: RawData[], categoryKey: string, valueKey: string) {
  if (!data?.length || !categoryKey || !valueKey) return [];

  const aggregationMap = new Map<string, number>();

  data.forEach((row) => {
    const categoryValue = String(row[categoryKey] ?? 'Unknown');
    const numericValue = parseNumeric(row[valueKey]) || 0;

    if (aggregationMap.has(categoryValue)) {
      aggregationMap.set(categoryValue, aggregationMap.get(categoryValue)! + numericValue);
    } else {
      aggregationMap.set(categoryValue, numericValue);
    }
  });

  return Array.from(aggregationMap.entries()).map(([key, value]) => ({
    [categoryKey]: key,
    [valueKey]: Math.round(value * 100) / 100, // Round to 2 decimal places
  })).sort((a, b) => {
    // Basic sorting for dates if detected
    const aVal = a[categoryKey];
    const bVal = b[categoryKey];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const aDate = Date.parse(aVal);
      const bDate = Date.parse(bVal);
      if (!isNaN(aDate) && !isNaN(bDate)) {
        return aDate - bDate;
      }
    }
    return 0;
  });
}

export function detectColumnTypes(data: any[]) {
  if (!data || data.length === 0) return {};
  
  const firstRow = data[0];
  const columns = Object.keys(firstRow);
  const types: Record<string, 'number' | 'string' | 'date'> = {};
  
  columns.forEach(col => {
    const val = firstRow[col];
    const parsedNum = parseNumeric(val);
    
    if (parsedNum !== null && typeof val !== 'boolean') {
      types[col] = 'number';
    } else if (!isNaN(Date.parse(val)) && typeof val === 'string' && val.includes('-')) {
      types[col] = 'date';
    } else {
      types[col] = 'string';
    }
  });
  
  return types;
}

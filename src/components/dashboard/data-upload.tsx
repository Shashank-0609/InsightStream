import { useDropzone } from 'react-dropzone';
import { Upload, FileCode, FileSpreadsheet, X, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface DataUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  fileName: string | null;
  onClear: () => void;
}

export function DataUpload({ onUpload, isLoading, fileName, onClear }: DataUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: false
  } as any);

  if (fileName) {
    return (
      <Card className="p-6 border-dashed border-2 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {fileName.endsWith('.csv') ? <FileSpreadsheet size={20} /> : <FileCode size={20} />}
          </div>
          <div>
            <p className="font-medium text-sm">{fileName}</p>
            <p className="text-xs text-muted-foreground uppercase">Dataset Loaded</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClear}>
          <X size={18} />
        </Button>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer hover:bg-muted/50",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        isLoading && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {isLoading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight">
            {isDragActive ? "Drop the file here" : "Upload your dataset"}
          </h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Drag and drop your CSV or JSON file here, or click to browse.
          </p>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1">
            <FileSpreadsheet size={14} className="text-green-600" />
            CSV
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1">
            <FileCode size={14} className="text-blue-600" />
            JSON
          </div>
        </div>
      </div>
    </div>
  );
}

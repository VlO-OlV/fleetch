import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileType } from '@/lib/consts';
import { X } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';

interface FileInputProps {
  fileType?: FileType;
  onPreviewChange?: (url: string | null) => void;
  onChange?: (file: File | null) => void;
}

export const FileInput: FC<FileInputProps> = ({
  fileType,
  onPreviewChange,
  onChange,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange?.(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      onPreviewChange?.(objectUrl);
    } else {
      setFile(null);
      onChange?.(null);
      setPreview(null);
      onPreviewChange?.(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    onChange?.(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      onPreviewChange?.(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const displayedFileName = useMemo(() => {
    if (!file) return null;
    const splittedFileName = file.name.split('.');
    const fileType = splittedFileName.pop();
    const fileName = splittedFileName.join('.');
    return (
      (fileName.length > 18
        ? `${fileName.slice(0, 8)}...${fileName.slice(fileName.length - 8, fileName.length)}`
        : fileName) + `.${fileType}`
    );
  }, [file]);

  return (
    <div className="flex items-center space-x-2">
      <Input
        id="file-input"
        type="file"
        accept={fileType}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Label htmlFor="file-input">
        <Button asChild variant="outline">
          <span>Choose File</span>
        </Button>
      </Label>
      {file ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {displayedFileName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            aria-label="Clear file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No file selected</span>
      )}
    </div>
  );
};

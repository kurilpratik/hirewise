import React, { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const UploadResumes = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "text/plain"];
    const allowedExtensions = [".pdf", ".txt"];
    const fileName = selectedFile.name.toLowerCase();
    const isValidType = allowedTypes.includes(selectedFile.type);
    const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidType && !isValidExtension) {
      alert("Please select a PDF or text file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
    if (selectedFile.size > maxSize) {
      alert("File size must not exceed 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-2 gap-4">
        {/* Single File Upload */}
        <div>
          <h3 className="py-2">Upload a single resume</h3>
          <div
            className={cn(
              "relative rounded-md border-2 border-dashed p-8 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-gray-100",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <Button onClick={handleUploadClick}>
                <Upload className="size-4" />
                <span>Upload</span>
              </Button>
              <div className="text-center">
                <p className="text-foreground text-sm">
                  Choose a PDF or text file or drag & drop it here.
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  PDF or TXT. Max 5 MB.
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.txt,text/plain"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {file && (
            <div className="mt-4">
              <div className="relative flex items-center gap-3 rounded-md border bg-white p-4">
                <FileText className="size-8 text-red-500" />
                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">
                    {file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex size-5 cursor-pointer items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600"
                  aria-label="Remove file"
                >
                  <X className="size-3 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Upload - Disabled with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <h3 className="py-2">Upload resumes in bulk</h3>
              <div
                className={cn(
                  "relative cursor-not-allowed rounded-md border-2 border-dashed p-8 opacity-50 transition-colors",
                  "border-border bg-gray-100",
                )}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <Button disabled>
                    <Upload className="size-4" />
                    <span>Upload</span>
                  </Button>
                  <div className="text-center">
                    <p className="text-foreground text-sm">
                      Choose PDFs or drag & drop them here.
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      PDF only. Max 20 MB per file.
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  disabled
                  className="hidden"
                />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>You need to purchase premium to unlock this feature</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default UploadResumes;

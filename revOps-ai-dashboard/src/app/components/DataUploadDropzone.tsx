'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface DataUploadDropzoneProps {
  onUpload: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export default function DataUploadDropzone({ 
  onUpload, 
  acceptedTypes = ['.csv', '.xlsx', '.xls', '.pdf'], 
  maxSize = 10 
}: DataUploadDropzoneProps) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = acceptedTypes.includes(extension);
      const isValidSize = file.size <= maxSize * 1024 * 1024;
      
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      processFiles(validFiles);
    }
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    for (const file of files) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessedFiles(prev => [...prev, file.name]);
    }
    
    setIsProcessing(false);
    onUpload(files);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
    setProcessedFiles(prev => prev.filter(name => name !== fileName));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
      case 'xlsx':
      case 'xls':
        return '📊';
      case 'pdf':
        return '📄';
      default:
        return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <motion.div
            animate={isDragOver ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
            className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <Upload className="w-8 h-8 text-blue-600" />
          </motion.div>

          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
            {isDragOver ? t.dropFilesHere : t.uploadBusinessData}
          </h3>
          
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {t.dragDropFiles}
          </p>

          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {acceptedTypes.map(type => (
              <span key={type} className="px-2 py-1 bg-gray-200 rounded-md">
                {type}
              </span>
            ))}
          </div>

          <p className="text-xs mt-2 text-gray-500">
            {t.maxFileSize}: {maxSize}MB
          </p>
        </div>
      </motion.div>

      {/* Processing Status */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-semibold text-blue-900">{t.aiAnalyzingData}</p>
                <p className="text-sm text-blue-700">{t.aiAnalyzingDataDesc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold" style={{ color: 'var(--text-heading)' }}>
            {t.uploadedFiles} ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => {
              const isProcessed = processedFiles.includes(file.name);
              return (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isProcessed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.name)}</span>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-heading)' }}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isProcessed ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.processed}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.processing}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(file.name)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

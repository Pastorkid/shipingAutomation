'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ManualDataUploadProps {
  onUploaded: () => void;
}

export default function ManualDataUpload({ onUploaded }: ManualDataUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/pdf',
        'text/plain'
      ];
      
      const isValid = validTypes.includes(file.type) || 
                     file.name.endsWith('.csv') || 
                     file.name.endsWith('.xlsx') || 
                     file.name.endsWith('.xls') || 
                     file.name.endsWith('.pdf') ||
                     file.name.endsWith('.txt');
      
      if (!isValid) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setIsUploading(true);
    
    try {
      toast.loading('Processing your files...');
      
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful upload
      setIsComplete(true);
      toast.dismiss();
      toast.success(`✅ Successfully processed ${uploadedFiles.length} file(s)!`);
      
      // Wait a moment before proceeding
      setTimeout(() => {
        onUploaded();
      }, 1000);
      
    } catch (error) {
      console.error('File upload error:', error);
      toast.dismiss();
      toast.error('Failed to process files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border-2 border-green-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Files Processed Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Your invoice data has been processed and is ready for payment tracking.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {uploadedFiles.length} file(s) uploaded • Ready to track payments
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border-2 border-gray-200 p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Invoice Data</h3>
        <p className="text-gray-600">
          Upload CSV, Excel, or PDF files with your invoice information to get started
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports CSV, Excel (.xlsx, .xls), PDF, and text files
          </p>
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 cursor-pointer"
          >
            Select Files
          </label>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expected Format */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Expected data format:</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700 text-sm">Customer Name (required)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700 text-sm">Email Address (required)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700 text-sm">Invoice Amount (required)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 text-sm">Invoice Date</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 text-sm">Due Date (required)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 text-sm">Payment Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Template */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Need a template?</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Download CSV Template
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">Quick Setup</span>
            </div>
            <p className="text-purple-700 text-sm">
              No integrations required - just upload your files and start tracking
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Smart Processing</span>
            </div>
            <p className="text-green-700 text-sm">
              AI-powered extraction and validation of your invoice data
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="text-center">
          <button
            onClick={handleUpload}
            disabled={isUploading || uploadedFiles.length === 0}
            className="text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Files...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload & Process Files</span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Secure processing • Automatic data extraction • Ready in minutes
          </p>
        </div>
      </div>
    </motion.div>
  );
}

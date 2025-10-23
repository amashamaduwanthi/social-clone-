import { useState, useRef, type ChangeEvent } from 'react';
import { FaSpinner, FaCloudUploadAlt, FaExclamationCircle } from 'react-icons/fa';

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  onError?: (error: string) => void;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  className?: string;
  buttonText?: string;
}

const ImageUpload = ({
                       onUploadComplete,
                       onError,
                       maxFileSizeMB = 5,
                       allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                       className = '',
                       buttonText = 'Click to upload an image'
                     }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get API key from environment variables
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreviewUrl(null);

    if (!allowedFileTypes.includes(file.type)) {
      const errorMsg = `Unsupported file type. Allowed types: ${allowedFileTypes.join(', ')}`;
      handleError(errorMsg);
      return;
    }

    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `File is too large. Maximum size: ${maxFileSizeMB}MB`;
      handleError(errorMsg);
      return;
    }

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    await uploadImage(file);
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
    onError?.(errorMsg);
    console.error('ImageUpload Error:', errorMsg);
  };

  const uploadImage = async (file: File) => {
    if (!IMGBB_API_KEY) {
      handleError('ImgBB API key is not configured');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to upload image');
      }

      onUploadComplete(data.data.url);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload image';
      handleError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadAreaClick = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
      <div className={`space-y-4 ${className}`}>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={allowedFileTypes.join(',')}
            className="hidden"
            disabled={isUploading}
            aria-label="File upload"
        />

        <div
            onClick={handleUploadAreaClick}
            className={`
          border-2 border-dashed rounded-lg p-6 text-center 
          transition-colors duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isUploading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500 hover:bg-gray-50'}
        `}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleUploadAreaClick()}
            aria-disabled={isUploading}
        >
          {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                <p className="text-gray-600">Uploading your image...</p>
              </div>
          ) : previewUrl ? (
              <div className="relative group">
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                  <span className="text-white font-medium">Change Image</span>
                </div>
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <FaCloudUploadAlt className="text-4xl text-gray-400" />
                <p className="text-gray-700 font-medium">{buttonText}</p>
                <p className="text-sm text-gray-500">
                  {allowedFileTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
                  {maxFileSizeMB && ` (Max ${maxFileSizeMB}MB)`}
                </p>
              </div>
          )}
        </div>

        {error && (
            <div
                className="flex items-start p-3 text-sm text-red-700 bg-red-100 rounded-lg"
                role="alert"
            >
              <FaExclamationCircle className="flex-shrink-0 mt-0.5 mr-2 text-red-500" />
              <span>{error}</span>
            </div>
        )}
      </div>
  );
};

export default ImageUpload;
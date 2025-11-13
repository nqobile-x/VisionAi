
import React, { useRef } from 'react';
import { UploadCloudIcon, XIcon } from './Icons';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imageUrl: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imageUrl, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative group">
          <img src={imageUrl} alt="Uploaded preview" className="w-full h-auto max-h-96 object-contain rounded-lg" />
          <button
            onClick={handleRemoveImage}
            disabled={disabled}
            className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50"
            aria-label="Remove image"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex justify-center w-full h-64 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none"
        >
          <span className="flex items-center space-x-2">
            <UploadCloudIcon className="w-8 h-8 text-gray-400" />
            <span className="font-medium text-gray-400">
              Drop an image, or{' '}
              <span className="text-blue-400 underline">browse</span>
            </span>
          </span>
          <input
            type="file"
            name="file_upload"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;

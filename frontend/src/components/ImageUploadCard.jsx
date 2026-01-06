import React from 'react';
import { Camera, RefreshCcw } from 'lucide-react';

const ImageUploadCard = ({ label, image, onImageChange, onRemove, inputId }) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
        {label}
      </label>
      <div
        className={`relative h-64 rounded-2xl border-2 border-dashed transition-all flex flex-center items-center justify-center overflow-hidden
          ${image ? 'border-blue-400 bg-white' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'}`}
      >
        {image ? (
          <img src={image} alt={label} className="w-full h-full object-cover" />
        ) : (
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
            <Camera className="w-10 h-10 text-slate-300" />
            <span className="text-sm text-slate-400 font-medium">사진 선택하기</span>
            <input
              type="file"
              className="hidden"
              onChange={onImageChange}
              accept="image/*"
              id={inputId}
            />
          </label>
        )}
        {image && (
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadCard;

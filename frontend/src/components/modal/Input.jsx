import React from 'react';

const Input = ({ label, id, type, placeholder, value, onChange, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
        {...props}
      />
    </div>
  );
};

export default Input;
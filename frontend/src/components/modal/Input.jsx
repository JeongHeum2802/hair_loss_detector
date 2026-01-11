import React from 'react';

const Input = ({ label, id, type, placeholder, value, onChange, children, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-800 placeholder:text-slate-400 outline-none transition-all font-medium ${props.error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 focus:ring-2'
            }`}
          {...props}
        />
        {children}
      </div>
      {props.error && (
        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{props.error}</p>
      )}
    </div>
  );
};

export default Input;
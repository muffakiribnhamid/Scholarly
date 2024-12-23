import React from 'react';

const Input = ({ type, placeholder, name, icon: Icon, onChange }) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-lg border border-gray-200
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          transition-all duration-200 outline-none text-gray-700
          placeholder:text-gray-400 bg-white
          ${Icon ? 'pl-10' : 'pl-4'}
          hover:border-gray-300
        `}
      />
    </div>
  )
}

export default Input;

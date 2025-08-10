"use client"

import { useState } from "react"

const Input = ({ type = "text", placeholder, value, onChange, className = "", icon: Icon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      {Icon && (
        <div
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <Icon size={20} strokeWidth={1.5} />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full py-4 ${Icon ? "pl-12" : "pl-4"} pr-4 
          bg-white
          border border-gray-200
          rounded-2xl 
          text-gray-900
          text-base
          placeholder-gray-400
          transition-all duration-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-gray-900
          focus:border-transparent
          hover:border-gray-300
          ${className}
        `}
        {...props}
      />
    </div>
  )
}

export default Input

"use client"

const Button = ({ children, onClick, type = "button", className = "", variant = "primary", disabled = false }) => {
  const baseClasses =
    "w-full px-6 py-4 font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-base"

  const variants = {
    primary: "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-300 border border-gray-200",
    ghost: "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-300",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button

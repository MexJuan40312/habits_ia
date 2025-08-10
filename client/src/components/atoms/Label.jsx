const Label = ({ htmlFor, children, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-gray-700 text-sm font-medium mb-2 ${className}`}>
      {children}
    </label>
  )
}

export default Label

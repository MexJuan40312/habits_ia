"use client"
import Input from "../atoms/Input"
import Label from "../atoms/Label"

const FormField = ({ label, type, placeholder, value, onChange, icon, error }) => {
  const fieldId = label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-gray-900 font-medium">
        {label}
      </Label>
      <Input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon={icon}
        className={error ? "border-red-300 focus:ring-red-500" : ""}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}

export default FormField

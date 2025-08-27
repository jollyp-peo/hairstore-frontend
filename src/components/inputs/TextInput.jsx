const TextInput = ({ label, name, value, onChange, placeholder, type = "text", required = false }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name} className="text-sm font-medium">{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
      />
    </div>
  );
};

export default TextInput;

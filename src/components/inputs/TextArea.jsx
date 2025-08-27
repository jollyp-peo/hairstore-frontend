const TextArea = ({ label, name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name} className="text-sm font-medium">{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
        rows={4}
      />
    </div>
  );
};

export default TextArea;

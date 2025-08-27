const FileInput = ({ label, name, onChange, multiple = false, required = false }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name} className="text-sm font-medium">{label}</label>}
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={onChange}
        required={required}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
};

export default FileInput;

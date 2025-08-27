const CheckboxInput = ({ label, name, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4"
      />
      {label}
    </label>
  );
};

export default CheckboxInput;

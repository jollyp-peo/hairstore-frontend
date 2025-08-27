import { useState } from "react";
import { Button } from "../../components/ui/Button";

function AddressForm({ initial = {}, onCancel, onSubmit, saving }) {
  const [form, setForm] = useState({
    first_name: initial.first_name || "",
    last_name: initial.last_name || "",
    phone: initial.phone || "",
    address: initial.address || "",
    city: initial.city || "",
    state: initial.state || "",
    zip_code: initial.zip_code || "",
    country: initial.country || "Nigeria",
    is_default: initial.is_default || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = () => {
    onSubmit(form);
  };

  return (
    <div className="space-y-3 border rounded-lg p-4 bg-card">
      <div className="grid grid-cols-2 gap-2">
        <input
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First name"
          className="border p-2 rounded"
          required
        />
        <input
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last name"
          className="border p-2 rounded"
          required
        />
      </div>

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="border p-2 rounded w-full"
        required
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Street address"
        className="border p-2 rounded w-full"
        required
      />

      <div className="grid grid-cols-3 gap-2">
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2 rounded"
          required
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="border p-2 rounded"
          required
        />
        <input
          name="zip_code"
          value={form.zip_code}
          onChange={handleChange}
          placeholder="ZIP"
          className="border p-2 rounded"
          required
        />
      </div>

      <input
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country"
        className="border p-2 rounded w-full"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
        />
        <span className="text-sm">Set as default address</span>
      </label>

      <div className="flex gap-2">
        <Button
          type="button"
          className="flex-1"
          disabled={saving}
          variant="luxury"
          size="sm"
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save address"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default AddressForm;

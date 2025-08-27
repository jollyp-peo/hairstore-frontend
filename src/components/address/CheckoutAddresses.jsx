import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import { fetchAddresses, addAddressApi } from "../../hooks/addressApi";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";

function CheckoutAddresses({ onSelectAddress, selectedAddress }) {
  const { accessToken } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(selectedAddress?.id || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // controls summary vs picker
  const [saving, setSaving] = useState(false);

  // fetch saved addresses
  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchAddresses(accessToken);
        setAddresses(list);

        // auto-select default or first address
        const defaultAddr = list.find((a) => a.is_default) || list[0] || null;
        if (defaultAddr && !selectedId) {
          setSelectedId(defaultAddr.id);
          onSelectAddress(defaultAddr);
        }
      } catch (err) {
        setError("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  // always keep one selected address if possible
  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedId(null);
      onSelectAddress(null);
      return;
    }
    const current = addresses.find((a) => a.id === selectedId);
    if (!current) {
      const fallback = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedId(fallback.id);
      onSelectAddress(fallback);
    }
  }, [addresses, selectedId, onSelectAddress]);

  const handleAdd = async (payload) => {
    try {
      setSaving(true);
      const newAddr = await addAddressApi(accessToken, payload);
      setAddresses((prev) => [newAddr, ...prev]);
      setSelectedId(newAddr.id);
      onSelectAddress(newAddr);
      setShowForm(false);
      setShowPicker(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (addr) => {
    if (!addr) {
      // fallback if deselect attempted
      const fallback = addresses.find((a) => a.is_default) || addresses[0] || null;
      if (fallback) {
        setSelectedId(fallback.id);
        onSelectAddress(fallback);
      }
      return;
    }
    setSelectedId(addr.id);
    onSelectAddress(addr);
    setShowPicker(false);
  };

  // summary view
  if (!loading && !showForm && !showPicker && selectedId) {
    const addr = addresses.find((a) => a.id === selectedId);
    return (
      <div className="p-4 border rounded-lg bg-muted space-y-2">
        <div>
          <p className="font-medium">
            {addr?.first_name} {addr?.last_name}
          </p>
          <p>{addr?.address}</p>
          <p>
            {addr?.city}, {addr?.state} {addr?.zip_code}
          </p>
          <p>{addr?.country}</p>
          <p className="text-sm text-muted-foreground">{addr?.phone}</p>
          {addr?.is_default && (
            <span className="text-xs text-green-600 font-semibold">Default</span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(true)}
        >
          Change Address
        </Button>
      </div>
    );
  }

  // picker view
  return (
    <div className="space-y-4">
      {loading && <p>Loading addresses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !showForm && (
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <div className="p-4 border rounded-lg text-center text-muted-foreground">
              <p>No addresses added yet.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setShowForm(true)}
              >
                + Add address
              </Button>
            </div>
          ) : (
            <>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelect(addr)}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedId === addr.id
                      ? "border-amber-500 bg-background"
                      : "hover:bg-muted"
                  }`}
                >
                  <p className="font-medium">
                    {addr.first_name} {addr.last_name}
                  </p>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.zip_code}
                  </p>
                  <p>{addr.country}</p>
                  <p className="text-sm text-muted-foreground">{addr.phone}</p>
                  {addr.is_default && (
                    <span className="text-xs text-green-600 font-semibold">
                      Default
                    </span>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                + Add new address
              </Button>
            </>
          )}
        </div>
      )}

      {showForm && (
        <AddressForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleAdd}
          saving={saving}
        />
      )}
    </div>
  );
}

export default CheckoutAddresses;

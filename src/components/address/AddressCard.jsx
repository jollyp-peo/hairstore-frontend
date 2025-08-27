import { Button } from "../../components/ui/Button";

function AddressCard({ addr, selected, onSelect, onUseDifferent }) {
  return (
    <div
      className={`p-4 rounded-lg border ${selected ? "border-primary bg-primary/5" : "border-muted"}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">
            {addr.first_name} {addr.last_name } {addr.is_default && <span className="text-xs ml-2 text-green-600">Default</span>}
          </div>
          <div className="text-sm text-muted-foreground">
            {addr.address}, {addr.city} {addr.state} {addr.zip_code}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {addr.country} · {addr.phone}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button size="sm" variant={selected ? "outline" : "solid"} onClick={() => onSelect(addr)}>
            {selected ? "Selected" : "Use this"}
          </Button>
          <button
            className="text-xs text-gray-500 hover:underline"
            onClick={() => onUseDifferent && onUseDifferent()}
          >
            Use different address
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddressCard;
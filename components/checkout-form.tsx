"use client";

type CheckoutFormProps = {
  formData: {
    customerName: string;
    email: string;
    phone: string;
    shippingCountry: string;
    shippingRegion: string;
    shippingCity: string;
    shippingPostcode: string;
    shippingAddress1: string;
    shippingAddress2: string;
  };
  onChange: (name: string, value: string) => void;
};

export default function CheckoutForm({
  formData,
  onChange,
}: CheckoutFormProps) {
  return (
    <div className="rounded-2xl border p-5 space-y-4">
      <h2 className="text-lg font-semibold">Shipping Details</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full name"
          value={formData.customerName}
          onChange={(e) => onChange("customerName", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="text"
          placeholder="Country"
          value={formData.shippingCountry}
          onChange={(e) => onChange("shippingCountry", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="text"
          placeholder="Address line 1"
          value={formData.shippingAddress1}
          onChange={(e) => onChange("shippingAddress1", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="text"
          placeholder="Address line 2"
          value={formData.shippingAddress2}
          onChange={(e) => onChange("shippingAddress2", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="text"
          placeholder="City"
          value={formData.shippingCity}
          onChange={(e) => onChange("shippingCity", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="text"
          placeholder="Region / State"
          value={formData.shippingRegion}
          onChange={(e) => onChange("shippingRegion", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />

        <input
          type="text"
          placeholder="Postcode"
          value={formData.shippingPostcode}
          onChange={(e) => onChange("shippingPostcode", e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
    </div>
  );
}
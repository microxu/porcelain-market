export type CheckoutDetails = {
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

export function validateCheckoutDetails(details: CheckoutDetails) {
  if (!details.customerName.trim()) {
    return "Full name is required.";
  }

  if (!details.email.trim()) {
    return "Email is required.";
  }

  if (!details.phone.trim()) {
    return "Phone is required.";
  }

  if (!details.shippingCountry.trim()) {
    return "Country is required.";
  }

  if (!details.shippingAddress1.trim()) {
    return "Address line 1 is required.";
  }

  if (!details.shippingCity.trim()) {
    return "City is required.";
  }

  if (!details.shippingPostcode.trim()) {
    return "Postcode is required.";
  }

  return null;
}
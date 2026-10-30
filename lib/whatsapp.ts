export function getWhatsAppUrl(number: string, text: string): string {
  const cleanNumber = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

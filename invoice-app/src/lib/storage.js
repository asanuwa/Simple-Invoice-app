const INVOICES_KEY = "invoices";
const COMPANY_KEY = "companyProfile";

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateInvoiceNumber(invoices) {
  const list = Array.isArray(invoices) ? invoices : [];
  const maxNum = list
    .map((i) => {
      const n = i?.invoiceNumber;
      if (typeof n !== "string") return NaN;
      // Accept formats like INV-00012 or 00012
      const m = n.match(/(\d+)(?!.*\d)/);
      return m ? Number(m[1]) : NaN;
    })
    .reduce((acc, v) => (Number.isFinite(v) ? Math.max(acc, v) : acc), 0);

  const next = maxNum + 1;
  const padded = String(next).padStart(5, "0");
  return `INV-${padded}`;
}

export function loadInvoices() {
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInvoices(invoices) {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices || []));
}

export function loadCompanyProfile() {
  try {
    const raw = localStorage.getItem(COMPANY_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCompanyProfile(profile) {
  localStorage.setItem(COMPANY_KEY, JSON.stringify(profile || {}));
}

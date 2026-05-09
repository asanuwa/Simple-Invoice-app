import { ui } from "../lib/uiClasses";

export default function InvoiceItemRow({ item }) {
  const qty = Number(item?.quantity ?? 0);
  const price = Number(item?.unitPrice ?? 0);
  const total = Number(item?.total ?? qty * price);

  function formatMoney(value) {
    const n = Number(value);
    return Number.isFinite(n)
      ? n.toLocaleString(undefined, { style: "currency", currency: "NGN" })
      : "-";
  }

  return (
    <div className={ui.detailTableRow}>
      <div>{item?.description || "-"}</div>
      <div className={ui.right}>{Number.isFinite(qty) ? qty : 0}</div>
      <div className={ui.right}>{formatMoney(price)}</div>
      <div className={ui.right}>{formatMoney(total)}</div>
    </div>
  );
}

import InvoiceItemRow from "./InvoiceItemRow";
import { ui } from "../lib/uiClasses";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return toNumber(value).toLocaleString(undefined, {
    style: "currency",
    currency: "NGN",
  });
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PartyBlock({ title, party }) {
  const addressLine = [party?.city, party?.country].filter(Boolean).join(", ");

  return (
    <section className={ui.detailParty}>
      <h3 className={ui.detailPartyTitle}>{title}</h3>
      <strong className="text-slate-950">{party?.name || "-"}</strong>
      {party?.email ? <span>{party.email}</span> : null}
      {party?.address ? <span>{party.address}</span> : null}
      {addressLine ? <span>{addressLine}</span> : null}
    </section>
  );
}

export default function InvoiceDetails({ invoice, onEdit, onDelete, onBack }) {
  if (!invoice) {
    return (
      <section className={ui.card}>
        <div className={ui.header}>
          <h2 className={ui.title}>Invoice</h2>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnGhost} ${ui.printHidden}`}
            onClick={onBack}
          >
            Back
          </button>
        </div>
        <p className={ui.muted}>No invoice selected.</p>
      </section>
    );
  }

  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const subtotal = toNumber(
    invoice.subtotal ??
      items.reduce((sum, item) => {
        return sum + toNumber(item.total ?? item.quantity * item.unitPrice);
      }, 0),
  );
  const tax = toNumber(invoice.tax);
  const total = toNumber(invoice.total ?? subtotal + tax);

  return (
    <section className={ui.card}>
      <div className={`${ui.header} ${ui.detailHeader}`}>
        <div>
          <p className={`${ui.muted} ${ui.small}`}>Invoice</p>
          <h2 className={ui.title}>{invoice.invoiceNumber || invoice.id}</h2>
        </div>
        <div className={`${ui.headerBtns} ${ui.printHidden}`}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnGhost}`}
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="button"
            className={ui.btn}
            onClick={() => onEdit?.(invoice.id)}
          >
            Edit
          </button>
          <button type="button" className={ui.btn} onClick={() => window.print()}>
            Print
          </button>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnDanger}`}
            onClick={() => onDelete?.(invoice.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className={ui.detailTop}>
        <div className={ui.readOnlyPartyGrid}>
          <PartyBlock title="From" party={invoice.from} />
          <PartyBlock title="Bill To" party={invoice.billTo || invoice.customer} />
        </div>

        <div className={ui.detailMeta}>
          <div className={ui.detailMetaRow}>
            <span>Issue date</span>
            <strong>{formatDate(invoice.issueDate)}</strong>
          </div>
          <div className={ui.detailMetaRow}>
            <span>Due date</span>
            <strong>{formatDate(invoice.dueDate)}</strong>
          </div>
          <div className={ui.detailMetaRow}>
            <span>Status</span>
            <strong className={ui.statusPill}>{invoice.status || "-"}</strong>
          </div>
          <div className={ui.detailMetaRow}>
            <span>Tax rate</span>
            <strong>{toNumber(invoice.taxRate)}%</strong>
          </div>
        </div>
      </div>

      <div className={ui.section}>
        <h3 className={ui.sectionTitle}>Items</h3>
        <div className={`${ui.table} mt-3`}>
          <div className={ui.detailTableHead}>
            <div>Description</div>
            <div className={ui.right}>Qty</div>
            <div className={ui.right}>Unit price</div>
            <div className={ui.right}>Total</div>
          </div>
          <div className={ui.tableBody}>
            {items.map((item) => (
              <InvoiceItemRow key={item.id || item.description} item={item} />
            ))}
            {items.length === 0 ? (
              <div className={ui.emptyTable}>No items yet.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={ui.detailBottom}>
        <section className={ui.detailNotes}>
          <h3 className={ui.sectionTitle}>Notes</h3>
          <p>{invoice.notes || "No notes added."}</p>
        </section>

        <div className={ui.totalsBox} aria-label="Invoice totals">
          <div className={ui.totalsRow}>
            <span>Subtotal</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>
          <div className={ui.totalsRow}>
            <span>Tax</span>
            <strong>{formatMoney(tax)}</strong>
          </div>
          <div className={`${ui.totalsRow} ${ui.grandTotal}`}>
            <span>Total</span>
            <strong>{formatMoney(total)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

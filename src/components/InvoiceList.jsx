import { ui } from "../lib/uiClasses";

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "NGN" });
}

function computeInvoiceTotal(invoice) {
  const items = Array.isArray(invoice?.items) ? invoice.items : [];
  const sum = items.reduce((acc, it) => {
    const line = Number(
      it?.total ?? Number(it?.quantity ?? 0) * Number(it?.unitPrice ?? 0),
    );
    return acc + (Number.isFinite(line) ? line : 0);
  }, 0);
  return sum;
}

export default function InvoiceList({
  invoices,
  onCreate,
  onSelectInvoice,
  onDelete,
  onClearAll,
}) {
  const list = Array.isArray(invoices) ? invoices : [];

  return (
    <section className={ui.card}>
      <div className={ui.header}>
        <h2 className={ui.title}>Invoices</h2>
        <div className={ui.headerBtns}>
          {onClearAll ? (
            <button
              type="button"
              className={`${ui.btn} ${ui.btnDanger}`}
              onClick={onClearAll}
            >
              Clear all
            </button>
          ) : null}
          <button type="button" className={ui.btn} onClick={onCreate}>
            + New Invoice
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className={ui.muted}>
          {list.length} invoice{list.length === 1 ? "" : "s"}
        </p>
      </div>

      {list.length === 0 ? (
        <p className={ui.empty}>No invoices yet</p>
      ) : null}

      {list.length > 0 ? (
        <div className={ui.table}>
          <div className={ui.tableHead}>
            <div>Invoice</div>
            <div className={ui.right}>Issue</div>
            <div className={ui.right}>Due</div>
            <div className={ui.right}>Total</div>
            <div className={ui.right}>Actions</div>
          </div>
          <div className={ui.tableBody}>
            {list.map((inv) => {
              const total = computeInvoiceTotal(inv);
              return (
                <div className={ui.tableRow} key={inv.id}>
                  <div>
                    <button
                      type="button"
                      className={ui.invLink}
                      onClick={() => onSelectInvoice?.(inv.id)}
                      aria-label={`Open ${inv.invoiceNumber || inv.id}`}
                    >
                      {inv.invoiceNumber || inv.id}
                    </button>
                    <div className={`${ui.muted} ${ui.small} capitalize`}>
                      {inv.status || "-"}
                    </div>
                  </div>
                  <div className={`${ui.right} ${ui.muted}`}>
                    {inv.issueDate || "-"}
                  </div>
                  <div className={`${ui.right} ${ui.muted}`}>
                    {inv.dueDate || "-"}
                  </div>
                  <div className={ui.right}>{formatMoney(total)}</div>
                  <div className="flex justify-end gap-2 text-right">
                    <button
                      type="button"
                      className={`${ui.btn} ${ui.btnGhost}`}
                      onClick={() => onSelectInvoice?.(inv.id)}
                    >
                      Details
                    </button>
                    {onDelete ? (
                      <button
                        type="button"
                        className={`${ui.btn} ${ui.btnDanger}`}
                        onClick={() => onDelete?.(inv.id)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}

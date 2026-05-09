import { useMemo, useState } from "react";
import { generateId } from "../lib/storage";
import { ui } from "../lib/uiClasses";

const emptyParty = {
  name: "",
  email: "",
  address: "",
  city: "",
  country: "",
};

const emptyItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateString, days) {
  const date = dateString ? new Date(`${dateString}T00:00:00`) : new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

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

function buildInitialForm(initialValue, companyProfile, nextInvoiceNumber) {
  const issueDate = initialValue?.issueDate || today();

  return {
    id: initialValue?.id || generateId(),
    invoiceNumber: initialValue?.invoiceNumber || nextInvoiceNumber || "",
    issueDate,
    dueDate: initialValue?.dueDate || addDays(issueDate, 14),
    status: initialValue?.status || "pending",
    taxRate: initialValue?.taxRate ?? 0,
    notes: initialValue?.notes || "",
    from: {
      ...emptyParty,
      ...(companyProfile || {}),
      ...(initialValue?.from || {}),
    },
    billTo: {
      ...emptyParty,
      ...(initialValue?.billTo || initialValue?.customer || {}),
    },
    items:
      Array.isArray(initialValue?.items) && initialValue.items.length > 0
        ? initialValue.items.map((item) => ({
            id: item.id || generateId(),
            description: item.description || "",
            quantity: item.quantity ?? 1,
            unitPrice: item.unitPrice ?? 0,
          }))
        : [{ ...emptyItem, id: generateId() }],
  };
}

function computeTotals(items, taxRate) {
  const normalizedItems = items.map((item) => {
    const quantity = toNumber(item.quantity);
    const unitPrice = toNumber(item.unitPrice);

    return {
      ...item,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * (toNumber(taxRate) / 100);

  return {
    normalizedItems,
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

export default function InvoiceForm({
  mode,
  initialValue,
  companyProfile,
  nextInvoiceNumber,
  onCancel,
  onSend,
  onSubmit,
}) {
  const [form, setForm] = useState(() =>
    buildInitialForm(initialValue, companyProfile, nextInvoiceNumber),
  );
  const [validationErrors, setValidationErrors] = useState({});

  const totals = useMemo(
    () => computeTotals(form.items, form.taxRate),
    [form.items, form.taxRate],
  );
  const inputClass = ui.input;
  const readOnlyInvoiceClass = `${ui.input} ${ui.readOnlyInput}`;
  const errorInputClass = `${ui.input} border-red-400 focus:border-red-500 focus:ring-red-500/10`;

  function getInputClass(errorKey, fallbackClass = inputClass) {
    return validationErrors[errorKey] ? errorInputClass : fallbackClass;
  }

  function getFieldError(errorKey) {
    return validationErrors[errorKey] ? (
      <span className={ui.fieldError}>{validationErrors[errorKey]}</span>
    ) : null;
  }

  function clearError(errorKey) {
    setValidationErrors((current) => {
      if (!current[errorKey]) return current;
      const next = { ...current };
      delete next[errorKey];
      return next;
    });
  }

  function updateField(field, value) {
    clearError(field);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateParty(party, field, value) {
    clearError(`${party}.${field}`);
    setForm((current) => ({
      ...current,
      [party]: { ...current[party], [field]: value },
    }));
  }

  function updateItem(id, field, value) {
    clearError(`items.${id}.${field}`);
    setForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [...current.items, { ...emptyItem, id: generateId() }],
    }));
  }

  function removeItem(id) {
    setForm((current) => ({
      ...current,
      items:
        current.items.length > 1
          ? current.items.filter((item) => item.id !== id)
          : current.items,
    }));
  }

  function buildInvoice(statusOverride) {
    const cleanedItems = totals.normalizedItems.map((item) => ({
      id: item.id,
      description: item.description.trim(),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    }));

    const errors = {};

    if (!form.invoiceNumber.trim()) {
      errors.invoiceNumber = "Invoice number is required.";
    }
    if (!form.issueDate) {
      errors.issueDate = "Issue date is required.";
    }
    if (!form.dueDate) {
      errors.dueDate = "Due date is required.";
    }
    Object.keys(emptyParty).forEach((field) => {
      if (!form.from[field].trim()) {
        errors[`from.${field}`] =
          field === "name"
            ? "Your company name is required."
            : `Your ${field} is required.`;
      }

      if (!form.billTo[field].trim()) {
        errors[`billTo.${field}`] =
          field === "name"
            ? "Client name is required."
            : `Client ${field} is required.`;
      }
    });

    cleanedItems.forEach((item) => {
      if (!item.description) {
        errors[`items.${item.id}.description`] = "Description is required.";
      }
      if (item.quantity <= 0) {
        errors[`items.${item.id}.quantity`] =
          "Quantity must be greater than zero.";
      }
      if (item.unitPrice < 0) {
        errors[`items.${item.id}.unitPrice`] = "Price cannot be negative.";
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return null;
    }

    setValidationErrors({});

    const now = new Date().toISOString();
    return {
      ...form,
      invoiceNumber: form.invoiceNumber.trim(),
      status: statusOverride || form.status,
      notes: form.notes.trim(),
      taxRate: toNumber(form.taxRate),
      items: cleanedItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      updatedAt: now,
      createdAt: initialValue?.createdAt || now,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const invoice = buildInvoice(mode === "create" ? "pending" : undefined);
    if (!invoice) return;

    onSubmit?.(invoice, form.from);
  }

  function handleSendClick() {
    const invoice = buildInvoice("sent");
    if (!invoice) return;

    onSend?.(invoice, form.from);
  }

  return (
    <form
      className={`${ui.card} ${ui.formCard}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={`${ui.header} ${ui.formHeader}`}>
        <h2 className={ui.title}>
          {mode === "create" ? "Create Invoice" : "Edit Invoice"}
        </h2>
        <button
          type="button"
          className={`${ui.btn} ${ui.btnGhost}`}
          onClick={onCancel}
        >
          Back
        </button>
      </div>

      <div className={ui.metaPanel}>
        <label className={ui.label}>
          <span className={ui.labelText}>Invoice number</span>
          <input
            className={getInputClass(
              "invoiceNumber",
              mode === "create" ? readOnlyInvoiceClass : inputClass,
            )}
            value={form.invoiceNumber}
            onChange={(event) =>
              updateField("invoiceNumber", event.target.value)
            }
            readOnly={mode === "create"}
          />
          {getFieldError("invoiceNumber")}
        </label>
        <label className={ui.label}>
          <span className={ui.labelText}>Issue date</span>
          <input
            className={getInputClass("issueDate")}
            type="date"
            value={form.issueDate}
            onChange={(event) => updateField("issueDate", event.target.value)}
          />
          {getFieldError("issueDate")}
        </label>
        <label className={ui.label}>
          <span className={ui.labelText}>Due date</span>
          <input
            className={getInputClass("dueDate")}
            type="date"
            value={form.dueDate}
            onChange={(event) => updateField("dueDate", event.target.value)}
          />
          {getFieldError("dueDate")}
        </label>
        <label className={ui.label}>
          <span className={ui.labelText}>Status</span>
          <select
            className={inputClass}
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>
        <label className={ui.label}>
          <span className={ui.labelText}>Tax rate (%)</span>
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            value={form.taxRate}
            onChange={(event) => updateField("taxRate", event.target.value)}
          />
        </label>
      </div>

      <div className={ui.partyGrid}>
        <fieldset className={ui.fieldset}>
          <legend className={ui.legend}>From</legend>
          {Object.keys(emptyParty).map((field) => (
            <label className={ui.label} key={field}>
              <span className={ui.labelText}>{field}</span>
              <input
                className={getInputClass(`from.${field}`)}
                value={form.from[field]}
                onChange={(event) =>
                  updateParty("from", field, event.target.value)
                }
              />
              {getFieldError(`from.${field}`)}
            </label>
          ))}
        </fieldset>

        <fieldset className={ui.fieldset}>
          <legend className={ui.legend}>Bill To</legend>
          {Object.keys(emptyParty).map((field) => (
            <label className={ui.label} key={field}>
              <span className={ui.labelText}>{field}</span>
              <input
                className={getInputClass(`billTo.${field}`)}
                value={form.billTo[field]}
                onChange={(event) =>
                  updateParty("billTo", field, event.target.value)
                }
              />
              {getFieldError(`billTo.${field}`)}
            </label>
          ))}
        </fieldset>
      </div>

      <div className={ui.section}>
        <div className={ui.sectionHeader}>
          <h3 className={ui.sectionTitle}>Line Items</h3>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnGhost}`}
            onClick={addItem}
          >
            Add row
          </button>
        </div>

        <div className={ui.itemEditor}>
          <div className={ui.itemEditorHead}>
            <div>Description</div>
            <div className={ui.right}>Qty</div>
            <div className={ui.right}>Unit price</div>
            <div className={ui.right}>Line total</div>
            <div />
          </div>

          {form.items.map((item) => {
            const lineTotal =
              toNumber(item.quantity) * toNumber(item.unitPrice);

            return (
              <div className={ui.itemEditorRow} key={item.id}>
                <label className="grid gap-1">
                  <input
                    className={getInputClass(`items.${item.id}.description`)}
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, "description", event.target.value)
                    }
                    placeholder="Description"
                  />
                  {getFieldError(`items.${item.id}.description`)}
                </label>
                <label className="grid gap-1">
                  <input
                    className={getInputClass(`items.${item.id}.quantity`)}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(item.id, "quantity", event.target.value)
                    }
                    aria-label="Quantity"
                  />
                  {getFieldError(`items.${item.id}.quantity`)}
                </label>
                <label className="grid gap-1">
                  <input
                    className={getInputClass(`items.${item.id}.unitPrice`)}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) =>
                      updateItem(item.id, "unitPrice", event.target.value)
                    }
                    aria-label="Unit price"
                  />
                  {getFieldError(`items.${item.id}.unitPrice`)}
                </label>
                <div className={ui.lineTotal}>{formatMoney(lineTotal)}</div>
                <button
                  type="button"
                  className={`${ui.btn} ${ui.btnGhost} ${ui.iconBtn}`}
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove line item"
                  disabled={form.items.length === 1}
                >
                  x
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={ui.formBottom}>
        <label className={`${ui.label} ${ui.notesField}`}>
          <span className={ui.labelText}>Notes</span>
          <textarea
            className={`${inputClass} ${ui.textarea}`}
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            rows="5"
            placeholder="Payment terms, thank-you note, or delivery details"
          />
        </label>

        <div className={ui.totalsBox} aria-live="polite">
          <div className={ui.totalsRow}>
            <span>Subtotal</span>
            <strong>{formatMoney(totals.subtotal)}</strong>
          </div>
          <div className={ui.totalsRow}>
            <span>Tax</span>
            <strong>{formatMoney(totals.tax)}</strong>
          </div>
          <div className={`${ui.totalsRow} ${ui.grandTotal}`}>
            <span>Total</span>
            <strong>{formatMoney(totals.total)}</strong>
          </div>
        </div>
      </div>

      <div className={ui.actions}>
        <button type="submit" className={`${ui.btn} ${ui.btnPrimary}`}>
          {mode === "create" ? "Save invoice" : "Update invoice"}
        </button>
        <button
          type="button"
          className={`${ui.btn} ${ui.btnBlue}`}
          onClick={handleSendClick}
        >
          Send invoice
        </button>
        <button
          type="button"
          className={`${ui.btn} ${ui.btnGhost}`}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

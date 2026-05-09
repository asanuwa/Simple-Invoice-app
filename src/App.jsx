import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

import InvoiceList from "./components/InvoiceList";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDetails from "./components/InvoiceDetails";
import { ui } from "./lib/uiClasses";

import {
  generateInvoiceNumber,
  loadCompanyProfile,
  loadInvoices,
  saveCompanyProfile,
  saveInvoices,
} from "./lib/storage";

function App() {
  const [view, setView] = useState("list");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const [invoices, setInvoices] = useState(() => loadInvoices());
  const [companyProfile, setCompanyProfile] = useState(() =>
    loadCompanyProfile(),
  );

  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    if (companyProfile) saveCompanyProfile(companyProfile);
  }, [companyProfile]);

  const selectedInvoice = useMemo(() => {
    if (!selectedInvoiceId) return null;
    return invoices.find((i) => i.id === selectedInvoiceId) || null;
  }, [invoices, selectedInvoiceId]);

  const nextInvoiceNumber = useMemo(
    () => generateInvoiceNumber(invoices),
    [invoices],
  );

  function goList() {
    setView("list");
    setSelectedInvoiceId(null);
  }

  function goCreate() {
    setView("create");
    setSelectedInvoiceId(null);
  }

  function goEdit(id) {
    setSelectedInvoiceId(id);
    setView("edit");
  }

  function goDetails(id) {
    setSelectedInvoiceId(id);
    setView("details");
  }

  function handleDelete(id) {
    const invoice = invoices.find((i) => i.id === id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    toast.success(`Deleted ${invoice?.invoiceNumber || "invoice"}`);
    goList();
  }

  function handleClearAll() {
    if (!window.confirm("Clear all invoices? This cannot be undone.")) return;
    setInvoices([]);
    toast.success("All invoices cleared");
    goList();
  }

  function openInvoiceDelivery(invoice) {
    const email = invoice?.billTo?.email?.trim();
    const invoiceNumber = invoice?.invoiceNumber || invoice?.id || "invoice";
    const subject = encodeURIComponent(`Invoice ${invoiceNumber}`);
    const body = encodeURIComponent(
      [
        `Hello ${invoice?.billTo?.name || ""},`,
        "",
        `Please find invoice ${invoiceNumber} attached as a PDF.`,
        "",
        "Thank you.",
      ].join("\n"),
    );

    window.setTimeout(() => {
      window.print();

      if (email) {
        window.location.href = `mailto:${encodeURIComponent(
          email,
        )}?subject=${subject}&body=${body}`;
      } else {
        toast.warning("No client email address was added");
      }
    }, 100);
  }

  function saveSentInvoice(invoice, formFrom) {
    const invoiceNumber = invoice.invoiceNumber || generateInvoiceNumber(invoices);
    const toSave = {
      ...invoice,
      invoiceNumber,
      status: "sent",
    };

    setInvoices((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const exists = list.some((inv) => inv.id === toSave.id);
      if (exists) {
        return list.map((inv) =>
          inv.id === toSave.id ? { ...inv, ...toSave } : inv,
        );
      }
      return [...list, toSave];
    });
    setCompanyProfile(formFrom);
    toast.success(`Invoice ${toSave.invoiceNumber} marked as sent`);
    goDetails(toSave.id);
    openInvoiceDelivery(toSave);
  }

  return (
    <div className={ui.appShell}>
      <Toaster richColors position="top-right" />
      <header className={ui.appTop}>
        <div className={ui.brand}>Simple Invoice</div>
        <nav className={ui.nav}>
          <button
            type="button"
            className={`${ui.navBtn} ${view === "list" ? ui.navBtnActive : ""}`}
            onClick={goList}
          >
            Invoices
          </button>
          <button
            type="button"
            className={`${ui.navBtn} ${view === "create" ? ui.navBtnActive : ""}`}
            onClick={goCreate}
          >
            Create
          </button>
          {selectedInvoiceId ? (
            <button
              type="button"
              className={`${ui.navBtn} ${
                view === "details" ? ui.navBtnActive : ""
              }`}
              onClick={() => setView("details")}
            >
              Details
            </button>
          ) : null}
        </nav>
      </header>

      <main className={ui.appMain}>
        {view === "list" ? (
          <InvoiceList
            invoices={invoices}
            onCreate={goCreate}
            onSelectInvoice={(id) => goDetails(id)}
            onDelete={handleDelete}
            onClearAll={import.meta.env.DEV ? handleClearAll : undefined}
          />
        ) : null}

        {view === "create" ? (
          <InvoiceForm
            mode="create"
            companyProfile={companyProfile}
            nextInvoiceNumber={nextInvoiceNumber}
            onCancel={goList}
            onSubmit={(invoice, formFrom) => {
              const invoicesNow = Array.isArray(invoices) ? invoices : [];
              const generatedInvoiceNumber = generateInvoiceNumber(invoicesNow);

              const toSave = {
                ...invoice,
                invoiceNumber: generatedInvoiceNumber,
                status: "pending",
              };

              setInvoices((prev) => [...(prev || []), toSave]);
              setCompanyProfile(formFrom);
              toast.success(`Invoice ${toSave.invoiceNumber} saved as pending`);
              goDetails(toSave.id);
            }}
            onSend={saveSentInvoice}
          />
        ) : null}

        {view === "edit" ? (
          <InvoiceForm
            mode="edit"
            companyProfile={companyProfile}
            initialValue={selectedInvoice}
            onCancel={goList}
            onSubmit={(updatedInvoice, formFrom) => {
              setInvoices((prev) => {
                const list = Array.isArray(prev) ? prev : [];
                return list.map((inv) =>
                  inv.id === updatedInvoice.id
                    ? { ...inv, ...updatedInvoice }
                    : inv,
                );
              });
              setCompanyProfile(formFrom);
              toast.success(
                `Invoice ${updatedInvoice.invoiceNumber || updatedInvoice.id} updated`,
              );
              goDetails(updatedInvoice.id);
            }}
            onSend={saveSentInvoice}
          />
        ) : null}

        {view === "details" ? (
          <InvoiceDetails
            invoice={selectedInvoice}
            onEdit={goEdit}
            onDelete={handleDelete}
            onBack={goList}
          />
        ) : null}
      </main>

      <footer className={`${ui.appFooter} ${ui.muted} ${ui.small}`} />
    </div>
  );
}

export default App;

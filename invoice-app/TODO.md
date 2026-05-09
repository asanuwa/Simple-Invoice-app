# TODO - Phase 4 (Invoice Form)

- [x] Inspect existing code for InvoiceForm / App / storage
- [x] Implement create/edit submit persistence in `src/App.jsx` (use local state + update localStorage)

- [ ] Ensure invoiceNumber generation on create
- [ ] Ensure edit replaces invoice by id
- [ ] Verify totals/line items persist and are editable
- [ ] Quick manual test: create → list → details → edit → refresh persistence





# Simple Invoice Software — Execution Roadmap

This roadmap converts the MVP plan into build steps you can execute in order.

---

## Phase 0 — Pre-flight (1–5 minutes)

- [ ] Confirm you can run the dev server:
  - `cd invoice-tools`
  - `npm install`
  - `npm run dev`
- [ ] Open `http://localhost:5173` (default Vite port)

---

## Phase 1 — App scaffold (UI shells) (Step 1)

**Goal:** Replace the starter `App.jsx` with a basic layout + navigation.

Tasks:

1. [ ] Update `src/App.jsx` with a simple view state:
   - `view = 'list' | 'create' | 'edit' | 'details'`
   - `selectedInvoiceId`
2. [ ] Create component stubs (empty UI) under `src/components/`:
   - `InvoiceList.jsx`
   - `InvoiceForm.jsx`
   - `InvoiceDetails.jsx`
   - `InvoiceItemRow.jsx`
3. [ ] Add minimal invoice styles:
   - Put styles in `src/App.css` (or `src/styles/app.css`) for now.

---

## Phase 2 — Storage layer (Step 2)

**Goal:** localStorage persistence works.

Tasks:

1. [ ] Create `src/lib/storage.js` with:
   - `loadInvoices()`
   - `saveInvoices(invoices)`
   - `loadCompanyProfile()` (optional)
   - `saveCompanyProfile(profile)` (optional)
   - `generateId()`
   - `generateInvoiceNumber(invoices)`
2. [ ] Ensure on app load:
   - `InvoiceList` can show existing invoices from storage.

---

## Phase 3 — Invoice List (Step 3)

**Goal:** User can see, open, and delete invoices.

Tasks:

1. [ ] Implement `InvoiceList` UI:
   - Show invoiceNumber, issueDate, dueDate, status, total
2. [ ] Add actions:
   - Open -> `details`
   - Delete -> remove from storage
   - Empty state -> “No invoices yet”

---

## Phase 4 — Invoice Form (Step 4)

**Goal:** Create & edit invoices with line items and live totals.

Tasks:

1. [ ] Implement `InvoiceForm`:
   - Customer “Bill To” fields
   - Company “From” fields (or profile)
   - invoice metadata: invoiceNumber, issueDate, dueDate, status
   - taxRate
   - notes
2. [ ] Implement line items:
   - Add/remove rows
   - Each row: description, quantity, unitPrice
   - Live computed totals
3. [ ] Save behavior:
   - Create new invoice if `mode==='create'`
   - Update existing invoice if `mode==='edit'`
   - Persist to localStorage

---

## Phase 5 — Invoice Details + Print (Step 5 + Step 6)

**Goal:** Read-only invoice view that prints cleanly.

Tasks:

1. [ ] Implement `InvoiceDetails`:
   - Render from/billTo/metadata/items/totals/notes
   - Buttons: Edit, Print
2. [ ] Add print styling:
   - `@media print` to hide app chrome/buttons
   - Ensure invoice area prints full page
3. [ ] Print handler:
   - “Print” button -> `window.print()`

---

## Phase 6 — Polish (Step 7)

**Goal:** Make it stable and usable.

Tasks:

1. [ ] Basic validation (prevent empty required fields)
2. [ ] Accessibility pass (labels, focus order)
3. [ ] Responsive layout sanity
4. [ ] Optional: add “Clear all invoices” in dev mode (or settings)

---

## Suggested next action

Start with **Phase 1 + Phase 2** (scaffold + storage), then move to list.

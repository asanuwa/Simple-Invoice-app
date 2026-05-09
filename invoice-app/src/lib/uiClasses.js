export const ui = {
  appShell:
    "flex min-h-screen w-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.78),transparent_280px)] text-slate-600",
  appTop:
    "sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-12 print:hidden",
  brand:
    "before:shadow-teal-900/15 inline-flex items-center gap-3 text-lg font-extrabold tracking-normal text-slate-950 before:h-9 before:w-9 before:rounded-lg before:bg-gradient-to-br before:from-teal-700 before:to-amber-500 before:shadow-xl",
  nav: "flex flex-wrap items-center justify-end gap-2",
  navBtn:
    "rounded-lg border border-teal-700 bg-teal-700 px-3.5 py-2 text-sm font-bold text-white shadow-[0_12px_22px_rgba(15,118,110,0.18)] transition hover:-translate-y-0.5 hover:border-teal-800 hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700",
  navBtnActive:
    "border-teal-900 bg-teal-900 text-white shadow-[0_12px_22px_rgba(15,118,110,0.22)]",
  appMain:
    "mx-auto flex w-full max-w-[1180px] justify-center px-4 py-8 sm:px-8 lg:px-12 print:block print:max-w-none print:p-0",
  appFooter: "px-4 pb-5 pt-2 print:hidden",

  card:
    "w-full max-w-[1040px] rounded-lg border border-slate-200/75 bg-white/90 p-5 text-left shadow-[0_24px_70px_-24px_rgba(15,23,42,0.18),0_10px_24px_-18px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-7 print:max-w-none print:border-0 print:bg-white print:p-0 print:shadow-none",
  formCard:
    "relative overflow-hidden border-teal-700/25 bg-[linear-gradient(135deg,rgba(13,148,136,0.08),transparent_38%),linear-gradient(315deg,rgba(245,158,11,0.09),transparent_34%),rgba(255,255,255,0.92)] before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-teal-700 before:via-amber-500 before:to-blue-600",
  header:
    "mb-5 flex items-center justify-between gap-4 border-slate-200/80",
  formHeader:
    "border-b pb-5 [&_h2]:after:mt-2.5 [&_h2]:after:block [&_h2]:after:h-1 [&_h2]:after:w-20 [&_h2]:after:rounded-full [&_h2]:after:bg-gradient-to-r [&_h2]:after:from-teal-700 [&_h2]:after:to-amber-500",
  detailHeader: "items-start",
  title: "m-0 text-2xl font-extrabold leading-tight tracking-normal text-slate-950",
  sectionTitle: "m-0 text-lg font-extrabold text-slate-950",
  headerBtns: "flex flex-wrap justify-end gap-2",

  btn:
    "rounded-lg border border-transparent bg-teal-700 px-4 py-2.5 font-extrabold text-white shadow-[0_12px_22px_rgba(15,118,110,0.18)] transition hover:-translate-y-0.5 hover:border-teal-700/30 hover:shadow-[0_16px_28px_rgba(15,118,110,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50",
  btnGhost: "",
  btnDanger: "",
  btnBlue: "",
  btnPrimary: "",

  muted: "text-slate-500",
  small: "text-sm",
  empty:
    "mt-4 rounded-lg border border-dashed border-slate-200/80 bg-white/55 p-7 text-center text-slate-500",

  metaPanel:
    "mt-5 grid gap-4 rounded-lg border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),transparent),rgba(13,148,136,0.06)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.52)] md:grid-cols-5",
  partyGrid: "mt-5 grid gap-5 md:grid-cols-2",
  readOnlyPartyGrid: "mt-0 grid gap-5 md:grid-cols-2",
  fieldset:
    "relative m-0 grid gap-3 rounded-lg border border-slate-200/80 bg-white/70 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)] before:absolute before:right-5 before:top-5 before:h-10 before:w-10 before:rounded-lg before:border before:border-slate-200 before:bg-[linear-gradient(135deg,rgba(13,148,136,0.12),transparent),rgba(255,255,255,0.74)]",
  legend: "pr-3 text-sm font-extrabold capitalize text-teal-800",
  label: "grid min-w-0 gap-2 font-bold text-slate-950",
  labelText: "text-sm font-semibold capitalize text-slate-500",
  input:
    "min-h-11 w-full box-border rounded-lg border border-slate-200/90 bg-white/85 px-3 py-2.5 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.46)] transition hover:border-teal-700/30 focus:border-teal-700/35 focus:outline-none focus:ring-4 focus:ring-teal-700/10",
  readOnlyInput:
    "bg-[linear-gradient(90deg,rgba(13,148,136,0.1),transparent),rgba(255,255,255,0.85)] font-extrabold text-teal-800",
  textarea:
    "min-h-36 resize-y",
  formError:
    "mt-3 rounded-lg border border-red-500/40 bg-red-50 px-3 py-2.5 text-red-700",
  fieldError: "mt-1 text-sm font-semibold text-red-600",

  section: "mt-6",
  sectionHeader: "mb-3 flex items-center justify-between gap-4",
  itemEditor:
    "overflow-hidden rounded-lg border border-teal-700/25 bg-white/75 shadow-[0_18px_40px_rgba(15,23,42,0.07)]",
  itemEditorHead:
    "grid min-w-[650px] grid-cols-[1.4fr_90px_130px_140px_52px] items-center gap-2.5 bg-[linear-gradient(90deg,rgba(13,148,136,0.1),rgba(245,158,11,0.08)),rgba(255,255,255,0.72)] px-3.5 py-3 text-sm font-bold uppercase tracking-normal text-slate-950",
  itemEditorRow:
    "grid min-w-[650px] grid-cols-[1.4fr_90px_130px_140px_52px] items-center gap-2.5 border-t border-slate-200/80 bg-white/65 px-3.5 py-3 focus-within:bg-teal-50/70",
  lineTotal: "text-right text-sm font-extrabold text-teal-800",
  iconBtn: "min-w-11 px-3",

  formBottom:
    "mt-6 flex items-start justify-between gap-4 border-t border-slate-200/80 pt-5 max-md:flex-col",
  notesField: "w-full flex-1 basis-[420px] max-md:basis-auto",
  totalsBox:
    "grid w-full flex-none basis-72 gap-2.5 rounded-lg border border-teal-700/25 bg-[linear-gradient(180deg,rgba(13,148,136,0.08),transparent),rgba(255,255,255,0.72)] p-4 text-slate-950 shadow-[0_18px_38px_rgba(15,23,42,0.08)] md:sticky md:top-24 md:w-auto",
  totalsRow: "flex justify-between gap-5",
  grandTotal:
    "mt-0.5 border-t border-slate-200 pt-3 text-xl font-extrabold text-teal-800 [&_strong]:text-2xl",
  actions:
    "mt-6 flex flex-wrap justify-end gap-2.5 border-t border-slate-200/80 pt-5",

  table:
    "overflow-x-auto rounded-lg border border-slate-200/80 bg-white/75",
  tableHead:
    "grid min-w-[780px] grid-cols-[1.2fr_120px_120px_160px_200px] items-center gap-2.5 bg-[linear-gradient(180deg,rgba(13,148,136,0.08),transparent),rgba(255,255,255,0.8)] px-3.5 py-3 text-sm font-bold text-slate-950",
  tableRow:
    "grid min-w-[780px] grid-cols-[1.2fr_120px_120px_160px_200px] items-center gap-2.5 border-t border-slate-200/80 px-3.5 py-3 transition hover:bg-teal-50/60",
  detailTableHead:
    "grid min-w-[560px] grid-cols-[minmax(0,1fr)_90px_130px_150px] items-center gap-2.5 bg-[linear-gradient(180deg,rgba(13,148,136,0.08),transparent),rgba(255,255,255,0.8)] px-3.5 py-3 text-sm font-bold text-slate-950",
  detailTableRow:
    "grid min-w-[560px] grid-cols-[minmax(0,1fr)_90px_130px_150px] items-center gap-2.5 border-t border-slate-200/80 px-3.5 py-3",
  tableBody: "flex flex-col",
  invLink:
    "m-0 border-0 bg-transparent p-0 text-left font-bold text-teal-800 hover:underline",
  right: "text-right",

  detailTop: "mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]",
  detailParty:
    "grid gap-1 rounded-lg border border-slate-200/80 bg-white/70 p-4",
  detailPartyTitle: "mb-2 text-lg font-extrabold text-slate-950",
  detailMeta:
    "grid gap-2.5 rounded-lg border border-slate-200/80 bg-white/70 p-4",
  detailMetaRow: "flex justify-between gap-3",
  statusPill:
    "inline-flex min-w-20 justify-center rounded-full bg-teal-50 px-2.5 py-1 text-center font-extrabold capitalize text-teal-800",
  detailBottom:
    "mt-6 flex items-start justify-between gap-4 max-md:flex-col",
  detailNotes: "flex-1 basis-[420px] whitespace-pre-wrap",
  emptyTable: "p-3 text-sm text-slate-500",
  printHidden: "print:hidden",
};

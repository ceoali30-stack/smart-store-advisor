export const styles = {
  page: {
    direction: "rtl",
    textAlign: "right",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
    background: "#f6f7f9",
    minHeight: "100vh",
    color: "#111827",
  },

  topBar: {
    color: "white",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
    borderRadius: "18px",
    position: "sticky",
top: "0",
zIndex: 1000,
backdropFilter: "blur(10px)",
background: "rgba(15, 23, 42, 0.92)",
  },

  quickNav: {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "20px",
  padding: "14px 18px",
  background: "white",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  position: "sticky",
  top: "110px",
  zIndex: 999,
},

quickNavLink: {
  textDecoration: "none",
  color: "#0f172a",
  background: "#f1f5f9",
  padding: "10px 14px",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "14px",
},

  mainTitle: {
    margin: "4px 0",
    fontSize: "22px",
    fontWeight: "800",
  },

  mutedWhite: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "12px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  refreshButton: {
    background: "white",
    color: "#0f172a",
    padding: "8px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },

  healthSection: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "24px",
    alignItems: "center",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
  },

  healthCircle: {
    width: "180px",
height: "180px",
    borderRadius: "50%",
    background: "#f8fafc",
 border: "12px solid #0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
  },

  healthNumber: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#0f172a",
  },

  healthLabel: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#475569",
  },

  section: {
    background: "white",
  padding: "20px",
    borderRadius: "18px",
    marginBottom: "18px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 22px rgba(0,0,0,0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "16px",
  },

  sectionEyebrow: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
  },

  sectionTitle: {
    margin: "8px 0 18px",
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
   gap: "14px",
marginBottom: "18px",
  },

  kpiCard: {
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  kpiTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "700",
  },

  kpiValue: {
    margin: "12px 0 0",
    fontSize: "24px",
    fontWeight: "900",
    color: "#111827",
  },

  healthGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },

  healthItem: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "14px",
  },

  healthItemTitle: {
    margin: "0 0 8px",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
  },

  healthItemValue: {
    fontSize: "18px",
    color: "#0f172a",
  },

  healthItemNote: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: "1.7",
  },

  priorityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },

  priorityCard: {
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid #e5e7eb",
  },

  priorityDanger: {
    background: "#fef2f2",
    borderColor: "#fecaca",
  },

  priorityWarning: {
    background: "#fffbeb",
    borderColor: "#fde68a",
  },

  prioritySuccess: {
    background: "#ecfdf5",
    borderColor: "#bbf7d0",
  },

  priorityTitle: {
    margin: 0,
    color: "#374151",
    fontWeight: "700",
    fontSize: "14px",
  },

  priorityValue: {
    margin: "10px 0",
    fontSize: "26px",
    fontWeight: "900",
  },

  priorityMessage: {
    margin: 0,
    color: "#374151",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  recommendationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  },

  recommendationCard: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "18px",
  },

  recommendationNumber: {
    margin: "0 0 8px",
    color: "#2563eb",
    fontWeight: "800",
    fontSize: "13px",
  },

  recommendationTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    color: "#111827",
  },

  recommendationText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#374151",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
    minWidth: "760px",
  },

  th: {
    padding: "12px",
    textAlign: "right",
    background: "#f1f5f9",
    color: "#334155",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: "800",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    color: "#111827",
  },

  filterButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  filterButton: {
    padding: "8px 14px",
    borderRadius: "999px",
    textDecoration: "none",
    background: "#f8fafc",
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
    border: "1px solid #e5e7eb",
  },

  filterActive: {
    background: "#0f172a",
    color: "white",
  },

  filterActiveDanger: {
    background: "#dc2626",
    color: "white",
  },

  filterActiveWarning: {
    background: "#d97706",
    color: "white",
  },

  emptyBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    color: "#6b7280",
    lineHeight: "1.8",
  },

  syncBox: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    color: "#334155",
    lineHeight: "1.8",
  },

 errorBox: {
  background: "white",
  padding: "28px",
  borderRadius: "16px",
  border: "1px solid #fecaca",
  color: "#991b1b",
},

demoNotice: {
  background: "#fffbeb",
  border: "1px solid #fde68a",
  color: "#92400e",
  padding: "12px 16px",
  borderRadius: "12px",
  marginBottom: "20px",
  fontSize: "14px",
  fontWeight: "700",
  lineHeight: "1.7",
},
    
};

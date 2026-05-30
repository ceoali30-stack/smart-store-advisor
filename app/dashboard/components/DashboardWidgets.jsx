import { styles } from "../styles/dashboardStyles";

export function HealthItem({ title, value, max, note }) {
  const percentage = Math.round((value / max) * 100);

  const progressColor =
    percentage >= 80
      ? "#16a34a"
      : percentage >= 50
      ? "#d97706"
      : "#dc2626";

  return (
    <div style={styles.healthItem}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          alignItems: "center",
        }}
      >
        <p style={styles.healthItemTitle}>{title}</p>

        <strong
          style={{
            fontSize: "15px",
            color: progressColor,
            fontWeight: "800",
          }}
        >
          {percentage}%
        </strong>
      </div>

      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: progressColor,
            borderRadius: "999px",
            transition: "0.4s",
          }}
        />
      </div>

      <p
        style={{
          margin: "0 0 8px",
          fontSize: "13px",
          color: "#475569",
          fontWeight: "700",
        }}
      >
        {value} من {max}
      </p>

      <p style={styles.healthItemNote}>{note}</p>
    </div>
  );
}

export function KpiCard({ title, value }) {
  return (
    <div style={styles.kpiCard}>
      <p style={styles.kpiTitle}>{title}</p>
      <h3 style={styles.kpiValue}>{value}</h3>
    </div>
  );
}

export function PriorityCard({ title, value, message, tone }) {
  const toneStyle =
    tone === "danger"
      ? styles.priorityDanger
      : tone === "warning"
      ? styles.priorityWarning
      : styles.prioritySuccess;

  return (
    <div style={{ ...styles.priorityCard, ...toneStyle }}>
      <p style={styles.priorityTitle}>{title}</p>
      <h3 style={styles.priorityValue}>{value}</h3>
      <p style={styles.priorityMessage}>{message}</p>
    </div>
  );
}

export function EmptyBox({ message }) {
  return <div style={styles.emptyBox}>{message}</div>;
}

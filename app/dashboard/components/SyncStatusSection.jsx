export default function SyncStatusSection({
  syncStatus,
  styles,
}) {
  return (
    <section style={styles.section}>
      <p style={styles.sectionEyebrow}>حالة المزامنة</p>

      <h2 style={styles.sectionTitle}>
        آخر حالة اتصال مع سلة
      </h2>

      <div style={styles.syncBox}>
        <p>
          الحالة:{" "}
          <strong>
            {syncStatus?.success === true
              ? "متصل"
              : syncStatus?.success === false
              ? "يوجد تنبيه"
              : "غير متوفر"}
          </strong>
        </p>

        <p>
          آخر تحديث:{" "}
          <strong>
            {syncStatus?.last_sync_at || "غير متوفر"}
          </strong>
        </p>
      </div>
    </section>
  );
}

import PrintButton from "../PrintButton";
import SyncOrdersButton from "../SyncOrdersButton";

export default function DashboardHeader({
  merchantId,
  styles,
}) {
  return (
    <div style={styles.topBar}>
      <div>
        <p style={styles.mutedWhite}>لوحة تحكم المتجر</p>
        <h1 style={styles.mainTitle}>مستشار المتجر الذكي</h1>
        <p style={styles.mutedWhite}>رقم المتجر: {merchantId}</p>
      </div>

      <div style={styles.actions}>
        <SyncOrdersButton merchantId={merchantId} />

        <PrintButton />

        <a
          href={`/dashboard?merchant_id=${merchantId}`}
          style={styles.refreshButton}
        >
          تحديث لوحة التحكم
        </a>

        <a
          href={`/charts?merchant_id=${merchantId}`}
          style={styles.refreshButton}
        >
          لوحة الرسوم والتحليلات
        </a>
      </div>
    </div>
  );
}

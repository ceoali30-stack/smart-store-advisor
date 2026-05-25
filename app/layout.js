import "./globals.css";
export const metadata = {
  title: "Smart Store Advisor",
  description: "AI-powered analytics app for Salla merchants"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

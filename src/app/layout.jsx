// src/app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "New Horse Web",
  description: "Racecards listing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

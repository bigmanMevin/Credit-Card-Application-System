import './globals.css';

export const metadata = {
  title: 'Credit Card Application',
  description: 'Apply for credit card online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

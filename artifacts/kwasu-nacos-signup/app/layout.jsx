import "./globals.css";

export const metadata = {
  title: "KWASU NACOS | Student Complaint Portal",
  description:
    "Generate your student credentials to access the KWASU NACOS complaint portal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
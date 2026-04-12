import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Title({ className = "" }: { className?: string }) {
  return (
    <h1
      className={`block text-xl font-extrabold md:text-3xl ${gabarito.className} ${className || ""}`}
    >
      <span className="text-orange-500">Pair</span>
      <span className="text-blue-500">ckle</span>
    </h1>
  );
}

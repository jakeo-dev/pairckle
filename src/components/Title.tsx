import { Gabarito } from "next/font/google";
const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import Image from "next/image";
import Link from "next/link";

export default function Title({ className = "" }: { className?: string }) {
  return (
    <Link href="/">
      <h1
        className={`flex items-center text-2xl font-extrabold md:text-3xl ${gabarito.className} ${className || ""}`}
      >
        <Image
          src="/pairckle-icon.png"
          width={512}
          height={512}
          alt="Pairckle logo"
          className="mr-1 w-7 md:mr-1.5 md:w-9"
        />
        <span className="hidden text-orange-500 sm:inline">Pair</span>
        <span className="hidden text-blue-500 sm:inline">ckle</span>
      </h1>
    </Link>
  );
}

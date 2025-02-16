import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const { pathname } = useRouter();

  return (
    <div className="absolute top-0 w-full text-center lg:flex justify-between p-8">
      <div className="text-left cursor-default">
        <h1 className="block text-3xl lg:text-3xl font-bold">
          <span className="text-orange-500">Pair</span>
          <span className="text-blue-500">ckle</span>
        </h1>
        <h2 className="block text-xs lg:text-sm text-gray-800 mt-1">
          Rank through pairwise comparisons
        </h2>
      </div>

      <div className="h-min flex gap-2 mt-4 lg:mt-0">
        <Link
          className={`${
            pathname == "/"
              ? "bg-gray-400/40"
              : "hover:bg-gray-400/20 active:bg-gray-400/30"
          } h-min flex justify-center items-center rounded-md text-sm lg:text-base transition px-2.5 py-1.5 lg:px-3 lg:py-2`}
          href="/"
        >
          Create a ranking
        </Link>
        <Link
          className={`${
            pathname == "/rankings"
              ? "bg-gray-400/40"
              : "hover:bg-gray-400/20 active:bg-gray-400/30"
          } h-min flex justify-center items-center rounded-md text-sm lg:text-base transition px-2.5 py-1.5 lg:px-3 lg:py-2`}
          href="/rankings"
        >
          Saved rankings
        </Link>
      </div>
    </div>
  );
}

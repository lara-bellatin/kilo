import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <Image
        src="/kilo-wordmark.svg"
        alt="Kilo"
        width={280}
        height={98}
        priority
        className="w-64 sm:w-72"
      />
      <p className="mt-8 max-w-xs text-center text-sm text-[#F2EFEA]/70">
        Tracking nutricional personal.
      </p>
    </main>
  );
}

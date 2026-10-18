import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="py-14 md:py-20">
      <div className="mx-auto max-w-[720px] px-5 sm:px-6">
        <p className="font-mono text-5xl font-semibold text-muted">404</p>
        <p className="mt-4 text-lg">Nothing here.</p>
        <Link
          href="/"
          className="mt-6 inline-block text-accent underline underline-offset-4"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}

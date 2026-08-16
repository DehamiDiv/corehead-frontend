import Link from "next/link";

export default function PublicSiteNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">
        404
      </p>
      <h1 className="text-3xl font-black text-slate-900 mb-3">Site not found</h1>
      <p className="text-slate-500 max-w-md mb-8">
        This public site URL does not exist, or the site is no longer active.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
      >
        Go to CoreHead
      </Link>
    </div>
  );
}

"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          {error?.message?.toString() || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

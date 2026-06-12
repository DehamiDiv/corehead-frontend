"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-md p-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

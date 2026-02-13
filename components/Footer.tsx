export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-200 bg-white/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600" />
          <span className="text-lg font-bold text-slate-900">Corehead</span>
        </div>

        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            GitHub
          </a>
        </div>

        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} Corehead Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

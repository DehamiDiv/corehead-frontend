export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
          <span className="text-lg font-bold text-white">Corehead</span>
        </div>

        <div className="flex gap-8 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors">
            GitHub
          </a>
        </div>

        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Corehead Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

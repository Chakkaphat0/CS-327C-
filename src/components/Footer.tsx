import { Github, BookOpen, Code } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-600 text-sm">
            <p>© 2025 Banker's Algorithm Simulator</p>
            <p className="text-slate-500 mt-1">Educational tool for operating systems concepts</p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              Documentation
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
            >
              <Code className="w-4 h-4" />
              Algorithm
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

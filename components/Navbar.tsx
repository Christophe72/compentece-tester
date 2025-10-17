import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold text-gray-800">WeBelec</div>
          <div className="text-sm text-gray-600 hidden sm:block">
            — TestCompétence
          </div>
        </div>

        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/test?domain=electricite"
            className="text-gray-700 hover:text-yellow-600 transition-colors"
          >
            Test
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-green-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

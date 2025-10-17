export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            © {currentYear} WeBelec — Respect du savoir-faire traditionnel
          </p>
          <p className="text-xs text-gray-500">
            Système d'évaluation des compétences en électricité et informatique
          </p>
        </div>
      </div>
    </footer>
  );
}

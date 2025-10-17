import Link from "next/link";

export default function Home() {
  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Test de Compétence Professionnelle
      </h1>
      <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">
        Évaluez vos candidats en électricité ou en informatique avec des tests
        fiables et soignés, conçus par des professionnels du métier.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
        <Link
          href="/test?domain=electricite"
          className="px-8 py-4 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          ⚡ Test Électricité
        </Link>
        <Link
          href="/test?domain=informatique"
          className="px-8 py-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          💻 Test Informatique
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Fonctionnalités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold mb-2">Tests Adaptatifs</h3>
            <p className="text-sm text-gray-600">
              Questions sélectionnées selon le niveau et le domaine
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-2">Résultats Détaillés</h3>
            <p className="text-sm text-gray-600">
              Analyse complète des performances par compétence
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔧</div>
            <h3 className="font-semibold mb-2">Interface Admin</h3>
            <p className="text-sm text-gray-600">
              Gestion des questions et suivi des candidats
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold"
        >
          📊 Accès Dashboard
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition-colors font-semibold"
        >
          🔑 Accès Administration
        </Link>
      </div>
    </section>
  );
}

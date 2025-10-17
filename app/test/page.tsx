import Link from "next/link";

type SearchParams = {
  domain?: string;
};

export default async function TestIndex({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const domain = params?.domain ?? "mixte";

  const getDomainInfo = (domain: string) => {
    switch (domain) {
      case "electricite":
        return {
          title: "Test Électricité",
          icon: "⚡",
          description:
            "Évaluation des compétences en électricité industrielle et domestique",
          color: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "informatique":
        return {
          title: "Test Informatique",
          icon: "💻",
          description: "Évaluation des compétences en informatique et réseaux",
          color: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          title: "Test Mixte",
          icon: "🔧",
          description: "Évaluation des compétences générales",
          color: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  const domainInfo = getDomainInfo(domain);

  return (
    <section className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{domainInfo.icon}</div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          {domainInfo.title}
        </h1>
        <p className="text-gray-600 mb-6">{domainInfo.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Information sur le test</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre de questions:</span>
            <span className="font-medium">10 questions</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Durée estimée:</span>
            <span className="font-medium">15-20 minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Domaine:</span>
            <span className="font-medium capitalize">{domain}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Lisez attentivement chaque question</li>
          <li>• Sélectionnez la réponse qui vous semble la plus appropriée</li>
          <li>• Vous pouvez revenir sur vos réponses avant de valider</li>
          <li>• Le test sera automatiquement soumis à la fin</li>
        </ul>
      </div>

      <div className="text-center">
        <Link
          href={`/test/nouveau?domain=${domain}`}
          className={`inline-block px-8 py-4 text-white font-semibold rounded-lg transition-colors ${domainInfo.color}`}
        >
          Commencer le test
        </Link>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </section>
  );
}

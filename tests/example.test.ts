// tests/example.test.ts
// Petit test d'exemple pour démarrer les tests dans ce projet Next.js + TypeScript.
// Instructions (FR):
// 1) Installer vite de test et dépendances (exemple):
//    npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
// 2) Ajouter un script de test dans package.json (optionnel):
//    "test": "vitest"
// 3) Lancer les tests:
//    npx vitest

import { describe, it, expect } from 'vitest'

describe('sanity', () => {
  it('fonctionne - test d exmple', () => {
    expect(true).toBe(true)
  })
})

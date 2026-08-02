import type { Metadata } from 'next';

import { CodeBlock, DocsShell, GuideSection } from '@/components/docs-shell';

export const metadata: Metadata = {
  title: 'Uyumluluk · UIXVISOR',
  description: 'UIXVISOR stable sürüm matrisi, kalite kapıları ve native E2E kapsamı.',
};

const MATRIX = [
  ['Node.js', '>=22.13'],
  ['Expo', '57.x'],
  ['React Native', '0.86.x'],
  ['React', '19.2.x'],
  ['NativeWind', '>=4 <5'],
  ['Reanimated', '4.5.x'],
  ['Worklets', '0.10.x'],
] as const;

export default function CompatibilityPage() {
  return (
    <DocsShell
      title="Uyumluluk ve kalite"
      description="Stable kabul edilen sürümler ve her release candidate’ın geçmesi gereken doğrulamalar."
    >
      <GuideSection title="Stable hedef matrisi">
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <tbody>
              {MATRIX.map(([layer, version]) => (
                <tr className="border-b border-zinc-200 last:border-0 dark:border-zinc-800" key={layer}>
                  <th className="px-4 py-3 font-medium">{layer}</th>
                  <td className="px-4 py-3 font-mono">{version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GuideSection>

      <GuideSection title="Kalite kapıları">
        <CodeBlock>{`npm run lint
npm run typecheck
npm test
npm run smoke:cli
npm run verify:build
npm run verify:tokens`}</CodeBlock>
      </GuideSection>

      <GuideSection title="Platform doğrulaması">
        <ul className="list-disc space-y-2 pl-6">
          <li>Registry manifestleri schema ve bağımlılık bütünlüğü açısından doğrulanır.</li>
          <li>CLI kurulum, ekleme, karşılaştırma ve güvenli dosya yazma akışları test edilir.</li>
          <li>Temel kullanıcı akışları Android ve iOS release build’lerinde doğrulanır.</li>
        </ul>
      </GuideSection>
    </DocsShell>
  );
}

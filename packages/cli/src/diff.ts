export type DiffLine =
  | { type: 'context'; text: string }
  | { type: 'add'; text: string }
  | { type: 'remove'; text: string };

export function diffLines(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const m = oldLines.length;
  const n = newLines.length;

  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i][j] =
        oldLines[i] === newLines[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < m && j < n) {
    if (oldLines[i] === newLines[j]) {
      result.push({ type: 'context', text: oldLines[i] });
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: 'remove', text: oldLines[i] });
      i += 1;
    } else {
      result.push({ type: 'add', text: newLines[j] });
      j += 1;
    }
  }
  while (i < m) {
    result.push({ type: 'remove', text: oldLines[i] });
    i += 1;
  }
  while (j < n) {
    result.push({ type: 'add', text: newLines[j] });
    j += 1;
  }

  return result;
}

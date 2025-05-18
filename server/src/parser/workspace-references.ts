import { Bounds } from './types';

const reverseReferenceMap = new Map<string, Bounds[]>();

export function clearReferences() {
  reverseReferenceMap.clear();
}

export function addReference(symbolName: string, bounds: Bounds) {
  if (!reverseReferenceMap.has(symbolName)) {
    reverseReferenceMap.set(symbolName, []);
  }
  reverseReferenceMap.get(symbolName)!.push(bounds);
}

export function getReferences(symbolName: string): Bounds[] {
  return reverseReferenceMap.get(symbolName) || [];
}

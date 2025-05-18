import { CodeSymbol } from './symbols';

const globalSymbolTable = new Map<string, CodeSymbol[]>();

export function clearGlobalSymbols() {
  globalSymbolTable.clear();
}

export function addGlobalSymbols(symbols: CodeSymbol[]) {
  for (const sym of symbols) {
    if (!globalSymbolTable.has(sym.name)) {
      globalSymbolTable.set(sym.name, []);
    }
    globalSymbolTable.get(sym.name)!.push(sym);
  }
}

export function hasGlobalSymbol(name: string): boolean {
  return globalSymbolTable.has(name);
}

export function getGlobalSymbols(name: string): CodeSymbol[] {
  return globalSymbolTable.get(name) || [];
}

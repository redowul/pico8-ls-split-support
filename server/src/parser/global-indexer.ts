import { Location, Position } from 'vscode-languageserver/node';
import { CodeSymbol, CodeSymbolType } from './symbols';
import ResolvedFile from './file-resolver';
import { addGlobalSymbols, clearGlobalSymbols } from './workspace-symbols';
import {
	iterateProject, Project,
  } from '../projects';
import { findSymbols } from './symbols';

export function indexText(uri: string, text: string) {
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trim();
    if (stripped.startsWith('--') || stripped === '') continue;

    const varMatch = line.match(/^\s*(\w+)\s*=\s*{/);
    if (varMatch) addSymbol(varMatch[1], makeLocation(uri, i, line));

    const funcMatch = line.match(/^function\s+(\w+)\s*\(/);
    if (funcMatch) addSymbol(funcMatch[1], makeLocation(uri, i, line));
  }
}

function addSymbol(name: string, loc: Location) {
  const symbol: CodeSymbol = {
    name,
    type: CodeSymbolType.GlobalVariable,
    loc: {
      start: {
        index: 0,
        line: loc.range.start.line + 1,
        column: loc.range.start.character,
        filename: ResolvedFile.fromFileURL(loc.uri),
      },
      end: {
        index: 0,
        line: loc.range.end.line + 1,
        column: loc.range.end.character,
        filename: ResolvedFile.fromFileURL(loc.uri),
      },
    },
    selectionLoc: {
      start: {
        index: 0,
        line: loc.range.start.line + 1,
        column: loc.range.start.character,
        filename: ResolvedFile.fromFileURL(loc.uri),
      },
      end: {
        index: 0,
        line: loc.range.start.line + 1,
        column: loc.range.start.character + name.length,
        filename: ResolvedFile.fromFileURL(loc.uri),
      },
    },
    detail: '',
    children: [],
  };

  addGlobalSymbols([symbol]);
}

function makeLocation(uri: string, lineNum: number, line: string): Location {
  return {
    uri,
    range: {
      start: Position.create(lineNum, 0),
      end: Position.create(lineNum, line.length),
    },
  };
}

export function collectGlobalSymbols(projects: Project[]) {
  clearGlobalSymbols();
  for (const project of projects) {
	iterateProject(project, node => {
	  const symbols = findSymbols(node.document.chunk);
	  addGlobalSymbols(symbols);
	});
  }
}

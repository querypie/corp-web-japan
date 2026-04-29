import path from "node:path";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import ts from "typescript";

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, "src");

export function createTsModuleLoader(mocks = {}) {
  const cache = new Map();

  function resolveModulePath(request, parentPath) {
    if (request.startsWith("@/")) {
      return path.join(srcRoot, `${request.slice(2)}.ts`);
    }

    if (request.startsWith("./") || request.startsWith("../")) {
      const candidate = path.resolve(path.dirname(parentPath), request);
      if (candidate.endsWith(".ts") || candidate.endsWith(".js")) {
        return candidate;
      }
      return `${candidate}.ts`;
    }

    return null;
  }

  function loadModule(modulePath) {
    const normalized = path.resolve(modulePath);
    if (cache.has(normalized)) {
      return cache.get(normalized).exports;
    }

    const source = readFileSync(normalized, "utf8");
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
      fileName: normalized,
    }).outputText;

    const cjsModule = { exports: {} };
    cache.set(normalized, cjsModule);

    const localRequire = (request) => {
      if (request in mocks) {
        return mocks[request];
      }

      const resolved = resolveModulePath(request, normalized);
      if (resolved) {
        return loadModule(resolved);
      }

      throw new Error(`Unsupported import in test loader: ${request}`);
    };

    const context = {
      module: cjsModule,
      exports: cjsModule.exports,
      require: localRequire,
      process,
      console,
      fetch: (...args) => global.fetch(...args),
      URL,
      JSON,
      Buffer,
      setTimeout,
      clearTimeout,
    };

    vm.runInNewContext(transpiled, context, { filename: normalized });
    return cjsModule.exports;
  }

  return {
    importModule(relativePath) {
      return loadModule(path.join(repoRoot, relativePath));
    },
  };
}

export function toPlainJson(value) {
  return JSON.parse(JSON.stringify(value));
}

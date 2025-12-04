import fg from "fast-glob";
import fs from "fs";
import ts from "typescript";

const apiDir = "src/app/api";
const output = "src/api-types/generated.ts";

function extractTypesFromFile(path: string) {
  const source = ts.createSourceFile(
    path,
    fs.readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true
  );

  let routeTypes: any = {};

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) &&
      node.name &&
      ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(node.name.text)
    ) {
      const method = node.name.text;

      const bodyType = node.parameters[0]?.type?.getText(source) ?? "unknown";
      const returnType = node.type?.getText(source) ?? "unknown";

      routeTypes[method] = {
        body: bodyType,
        response: returnType,
      };
    }
    ts.forEachChild(node, visit);
  }

  visit(source);

  return routeTypes;
}

async function main() {
  const files = await fg(`${apiDir}/**/*.ts`);
  let outputObj: Record<string, any> = {};

  for (const file of files) {
    const route = file
      .replace(apiDir, "")
      .replace("/route.ts", "")
      .replace(/\/\[[^\]]+\]/g, "/:param");

    const types = extractTypesFromFile(file);

    if (Object.keys(types).length > 0) {
      outputObj[route] = types;
    }
  }

  const fileContent = `export const AppAPI = ${JSON.stringify(
    outputObj,
    null,
    2
  )} as const;`;

  fs.writeFileSync(output, fileContent);
  console.log("✅ api-types gerados com sucesso!");
}

main();

import visit from "unist-util-visit";
import { getPageType } from "./utils";
const remove = require("unist-util-remove");

module.exports = function () {
  return (tree, file) => {
    let isConditional = false;
    const shoudDeleteNodes = [];
    const filePath = file.path || (file.history && file.history[0]);

    visit(tree, (node, index, parent) => {
      const openIfRegex = /<if platform="(.+?)">/;
      const closeIfRegex = /<\/if>/;

      const openMatch = openIfRegex.exec(node.value);
      const closeMatch = closeIfRegex.exec(node.value);

      if (openMatch) {
        const platform = openMatch[1];
        const shouldRender = platform === getPageType(filePath);

        if (!shouldRender) {
          isConditional = true;
        }
      }
      if (closeMatch) {
        isConditional = false;
      }

      if (openMatch || closeMatch || isConditional) {
        shoudDeleteNodes.push(node);
      }
    });

    shoudDeleteNodes.forEach((n) => remove(tree, n));
  };
};

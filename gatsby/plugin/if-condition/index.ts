import visit from "unist-util-visit";
import { CLOSE_IF_REGEX, getPageType, OPEN_IF_REGEX } from "./utils";
const remove = require("unist-util-remove");

module.exports = function () {
  return (tree, file) => {
    let isConditional = false;
    const shoudDeleteNodes = [];
    const filePath = file.path || (file.history && file.history[0]);

    visit(tree, (node, index, parent) => {
      const openMatch = OPEN_IF_REGEX.exec(node.value);
      const closeMatch = CLOSE_IF_REGEX.exec(node.value);

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

import { parseMarkdownCode } from "./json";
import { parseMarkdownSQL } from "./sql";

const handlers = [parseMarkdownCode, parseMarkdownSQL];
export const pipleLineHandler = (input: string) => {
  return handlers.reduce((acc, handler) => handler(acc), input);
};

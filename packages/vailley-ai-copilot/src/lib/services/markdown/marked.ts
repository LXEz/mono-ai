import * as marked from "marked";

export const convertMarkdownToHTML = (text: string) => {
  return `${marked.parse(extractMarkdownContent(text))}`;
};

export const extractMarkdownContent = (input: string) => {
  if (input) {
    const regex = /^```markdown\s*([\s\S]*?)```$/;
    const match = regex.exec(input.trim());
    if (match) {
      return match[1].trim();
    } else {
      return input;
    }
  }
  return input;
};

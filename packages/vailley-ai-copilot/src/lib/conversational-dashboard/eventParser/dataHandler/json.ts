const jsonRegex = /```json\s*([\s\S]*?)```/;

export const parseMarkdownCode = (input: string) => {
  const match = input.match(jsonRegex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      return match[1];
    }
  }

  return input;
};

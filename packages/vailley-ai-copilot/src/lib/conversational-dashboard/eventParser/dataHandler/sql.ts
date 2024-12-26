const sqlRegex = /```sql\s*([\s\S]*?)\s*```/;

export const parseMarkdownSQL = (input: string = "") => {
  if (typeof input !== "string") {
    return input;
  }

  const match = input.match(sqlRegex);

  if (match && match[1]) {
    try {
      return match[1];
    } catch (error) {
      return input;
    }
  }

  return input;
};

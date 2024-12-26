export function getQueryObject(url: string) {
  if (`${url}`.length === 0) return {};

  const urlObj = new URL(url);
  const searchParams = new URLSearchParams(urlObj.search);

  const queryObject: { [key: string]: string | null } = {};
  searchParams.forEach((value, key) => {
    queryObject[key] = value;
  });

  return queryObject;
}

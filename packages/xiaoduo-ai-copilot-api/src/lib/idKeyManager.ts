export enum APP_NAME_ENUM {
  compose = 'compose',
  compare = 'compare',
  summarise = 'summarise',
  freePlay = 'freePlay',
  freePlayTranslator = 'freePlayTranslator',
}

/**
 *
 * @param appName
 * @returns
 */
export function getAppid(appName: APP_NAME_ENUM) {
  return process.env[`SUPER_ALPHA_${appName}_APP_ID`];
}

export function getApiKey(appName: APP_NAME_ENUM) {
  return process.env[`SUPER_ALPHA_${appName}_API_KEY`];
}

import fs from 'fs';
import path from 'path';

const getPackageInfo = () => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return { name: packageJson.name, version: packageJson.version };
};

const packageInfo = getPackageInfo();

const nextConfig = {
  env: {
    PACKAGE_NAME: packageInfo.name,
    PACKAGE_VERSION: packageInfo.version,
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test instanceof RegExp && rule.test.test('.svg'),
    );
    fileLoaderRule.exclude = /\.svg$/i;
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;

import fs from 'fs';
import path from 'path';

const getPackageInfo = () => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return { name: packageJson.name, version: packageJson.version };
};

const packageInfo = getPackageInfo();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PACKAGE_NAME: packageInfo.name,
    PACKAGE_VERSION: packageInfo.version,
  },
  output: 'standalone',
};

export default nextConfig;

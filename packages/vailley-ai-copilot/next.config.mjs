import fs from "fs";
import path from "path";

const getPackageInfo = () => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return { name: packageJson.name, version: packageJson.version };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PACKAGE_NAME: getPackageInfo().name,
    PACKAGE_VERSION: getPackageInfo().version,
  },
  experimental: {
    instrumentationHook: true,
  },
  output: "standalone",
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@opentelemetry/exporter-jaeger");
      config.externals.push("@azure/monitor-opentelemetry");
    }

    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  async rewrites() {
    console.log("Rewrites configuration applied");
    return [
      {
        source: "/api/chats",
        destination: "https://client-api.aibizplatform.com/chats",
      },
    ];
  },
};

export default nextConfig;

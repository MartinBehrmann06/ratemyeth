import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ethz.ch",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vm-images-test.global.ssl.fastly.net', 'jj-images-test.global.ssl.fastly.net', 'jx-images-test.global.ssl.fastly.net', 'images.jackjones.com', 'images.veromoda.com'],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;

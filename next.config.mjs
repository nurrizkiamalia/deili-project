/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/did0ox55z/image/upload/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  
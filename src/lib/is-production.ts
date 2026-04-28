const isProduction = () => {
  return process.env.VERCEL_TARGET_ENV === 'production';
};

export default isProduction;

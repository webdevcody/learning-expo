module.exports = (api) => {
  // Enable caching for faster builds
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Add class static block transform
      "@babel/plugin-transform-class-static-block",
    ].filter(Boolean),
  };
};

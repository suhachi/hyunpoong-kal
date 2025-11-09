let plugins;

try {
  const { version } = require('tailwindcss/package.json');
  const [major] = version.split('.');

  if (Number(major) >= 4) {
    require.resolve('@tailwindcss/postcss');
    plugins = {
      '@tailwindcss/postcss': {},
    };
  } else {
    throw new Error('Tailwind CSS v4 미사용');
  }
} catch {
  plugins = {
    tailwindcss: {},
    autoprefixer: {},
  };
}

export default {
  plugins,
};


import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import globFast from 'fast-glob';
import { cleandir } from 'rollup-plugin-cleandir';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// 找到所有实现文件（排除.d.ts文件）
const entries = globFast.sync(['src/**/*.ts', '!src/**/*.d.ts'], { dot: true });

// 基础配置
const basePlugins = [
  resolve(),
  commonjs(),
  json(),
  typescript({
    tsconfig: './tsconfig.json',
  }),
  process.env.BUILD_ENV === 'production' ? terser() : null,
];

// 创建单独的 CommonJS 构建
const cjsConfig = {
  input: entries,
  output: {
    dir: 'dist',
    format: 'cjs',
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    exports: 'named',
    sourcemap: false,
  },
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [...basePlugins],
};

// 创建单独的 ESM 构建
const esmConfig = {
  input: entries,
  output: {
    dir: 'dist',
    format: 'esm',
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name]-[hash].mjs',
    sourcemap: false,
  },
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [...basePlugins],
};

// 在第一个配置中清理目录
const firstConfig = {
  ...cjsConfig,
  plugins: [cleandir('dist'), ...cjsConfig.plugins],
};

export default [
  firstConfig, // 先清理目录再生成 CJS
  esmConfig, // 然后生成 ESM
];

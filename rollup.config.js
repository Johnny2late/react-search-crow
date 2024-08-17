import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import tsPlugin from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import babel from '@rollup/plugin-babel';

import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      tsPlugin(
        {
          tsconfig: "./tsconfig.json",
          exclude: ['**/*.test.tsx', '**/*.test.ts'],
        }
      ),
      terser(),
      postcss(),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react'],
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.types, 
        format: 'es5',
      },
    ],
    plugins: [dts.default()],
    external: [/\.css/],
  },
];
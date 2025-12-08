// FRONTEND - eslint.config.js (o el archivo que estés usando)
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([

  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        // Entorno de navegador
        ...globals.browser,
      },
    },
  },

  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    files: ["src/tests/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        // Jest: describe, test, expect, jest, beforeEach, afterEach, etc.
        ...globals.jest,
        // Node: module, require si llegas a usarlos
        ...globals.node,
      },
    },
  },
]);

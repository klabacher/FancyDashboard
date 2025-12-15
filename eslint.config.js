import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'src-tauri', 'coverage', 'node_modules'] },
  
  // 1. Configs Base Recomendadas (A Fundação Sólida)
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // "recommended" é mais estável que "strict"
      // Se quiser ser chato: ...tseslint.configs.strict, 
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // 2. Plugins Oficiais (Nada de wrappers estranhos)
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': react,
      'prettier': prettier,
    },
    settings: {
      react: { version: 'detect' }, // Crucial para estabilidade do plugin React
    },
    rules: {
      // Regras do React Hooks (Agora nativas na v5+)
      ...reactHooks.configs.recommended.rules,
      
      // Regras do React (Filtradas para o novo JSX Transform)
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // Seus Overrides de Segurança
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      
      // Prettier como regra de erro (mantém o código limpo sem briga)
      'prettier/prettier': 'error',
    },
  },
  
  // 3. Desativa conflitos de formatação (Sempre o último)
  eslintConfigPrettier
);
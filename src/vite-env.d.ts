/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_COMING_SOON_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FETCH_USER_API_URL: string;
    readonly VITE_FETCH_USER_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export interface AppConfig {
  api_url: string;
}

const { VITE_API_URL } = import.meta.env;

export const varEnv: AppConfig = {
  api_url: 'http://localhost:3000'
};

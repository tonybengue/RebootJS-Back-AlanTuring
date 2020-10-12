import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

config();
const defaultConfig = JSON.parse(readFileSync(resolve(__dirname, '../config.json')).toString());

export interface IConfig {
  PORT: number;
  mongo_host: string;
  mongo_user: string;
  mongo_pass: string;
  mongo_database: string;
  
  express_debug: boolean;
  mongo_debug: boolean;
}

export function configuration(): IConfig {
  const result: any = { ...defaultConfig };
  for (const key in result) {
    if (key in process.env) result[key] = process.env[key];
  }
  
  return result;
}

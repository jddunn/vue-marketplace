import { Sequelize } from 'sequelize';
import config from './config/config.json';

// Define the shape of our configuration
interface DBConfig {
    url: string;
    dialect: 'postgres';
    username: string;
    password: string;
}

interface Config {
    development: DBConfig;
    test: DBConfig;
    production: DBConfig;
}

// Type assertion to ensure the config.json conforms to our Config interface
const dbConfig: Config = config as Config;

const env = (process.env.NODE_ENV || 'development') as keyof Config;
const currentConfig = dbConfig[env];

const sequelize = new Sequelize(currentConfig.url, {
    dialect: currentConfig.dialect,
});

export { sequelize };

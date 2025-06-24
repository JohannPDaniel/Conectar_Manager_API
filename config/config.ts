import { Dialect } from 'sequelize';
import 'dotenv/config';

interface SequelizeConfig {
  use_env_variable: string;
  dialect: Dialect;
}

interface ConfigObject {
  [key: string]: SequelizeConfig;
}

const config: ConfigObject = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
};

export default config;

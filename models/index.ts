import fs from 'fs';
import path from 'path';
import process from 'process';
import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import configFile from '../config/config';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db: Record<string, any> = {};

let sequelize: Sequelize;

if ('use_env_variable' in config && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config,
  );
} else {
  throw new Error('DATABASE_URL is missing in environment');
}

const modelFiles = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.ts') &&
    !file.endsWith('.test.ts')
  );
});

for (const file of modelFiles) {
  const modelModule = (await import(path.join(__dirname, file))) as {
    default: (
      sequelize: Sequelize,
      dataTypes: typeof DataTypes,
    ) => ModelStatic<Model> & { associate?: (db: any) => void };
  };
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

for (const model of Object.values(db)) {
  const maybeModel = model as ModelStatic<any> & {
    associate?: (db: Record<string, unknown>) => void;
  };
  if (typeof maybeModel.associate === 'function') {
    maybeModel.associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

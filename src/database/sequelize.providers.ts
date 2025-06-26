import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('A variável DATABASE_URL não está definida!');
      }

      const sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        models: [User],
        logging: false,
      });

      await sequelize.authenticate();
      return sequelize;
    },
  },
];

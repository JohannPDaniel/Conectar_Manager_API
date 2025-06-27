import { Sequelize } from 'sequelize-typescript';
import { User } from '../auth/user.model';

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
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // ⚠️ cuidado com isso em produção
          },
        },
      });

      await sequelize.authenticate();
      return sequelize;
    },
  },
];

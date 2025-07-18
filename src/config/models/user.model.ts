import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreateUserDto } from '../../modules/auth/dto';
import { UserRole } from '../types';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User, CreateUserDto> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.ENUM(...Object.values(UserRole)), allowNull: false })
  declare role: UserRole;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'last_login' })
  declare lastLogin: Date | null;

  @Column({ type: DataType.STRING, allowNull: true, field: 'access_token' })
  declare accessToken: string;
}

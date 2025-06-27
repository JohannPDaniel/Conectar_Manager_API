import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserRole } from '../types/userRoles';
import { CreateUserDto } from './dto/createUser.dto';

@Table({ tableName: 'users' })
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

  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}

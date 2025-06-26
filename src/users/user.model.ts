import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserRole } from '../types/userRoles';
import { CreateUserDto } from './dto/createUser.dto';

@Table
export class User extends Model<User, CreateUserDto> {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.ENUM(...Object.values(UserRole)), allowNull: false })
  role!: UserRole;
}

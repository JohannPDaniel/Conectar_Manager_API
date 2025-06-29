import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Default,
} from 'sequelize-typescript';

@Table({ tableName: 'sessions', timestamps: false })
export class Session extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare token: string;
}

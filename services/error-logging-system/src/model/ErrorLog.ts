import { DataTypes, Model } from "sequelize";
import sequelize from "../db/db";

export interface ErrorLogAttributes {
  id?: number;
  applicationId: string;
  origin: string;
  message: string;
  stack?: string;
  statusCode: number;
  metadata?: object | null;
  createdAt: Date;
}

export class ErrorLog
  extends Model<ErrorLogAttributes>
  implements ErrorLogAttributes
{
  public id!: number;
  public applicationId!: string;
  public origin!: string;
  public message!: string;
  public stack?: string;
  public statusCode!: number;
  public metadata?: object | null;
  public createdAt!: Date;
}

ErrorLog.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    applicationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stack: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statusCode: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "error_logs",
    modelName: "ErrorLog",
  }
);

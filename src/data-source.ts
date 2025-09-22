import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",   
  password: "123456",    
  database: "sgroupwebbe",       
  entities: ["src/entity/*.ts"],
  synchronize: true,
  logging: true,
});

import { DataSource } from "typeorm";
import { parse } from "pg-connection-string";
import Andamento from "./models/andamento";
import TipoSpesa from "./models/tipo-spesa";
import Token from "./models/token";
import Utente from "./models/utente";

const connectionOptions = parse(process.env.DATABASE_URL as string);

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: connectionOptions.host as string,
  port: (connectionOptions.port as unknown as number) || 5432,
  username: connectionOptions.user as string,
  password: connectionOptions.password as string,
  database: connectionOptions.database as string,
  schema: "gc",
  entities: [Andamento, TipoSpesa, Utente, Token],
  logging: true,
  ssl: true,
  extra: { ssl: { rejectUnauthorized: false } },
});

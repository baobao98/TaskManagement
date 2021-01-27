import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_CONFIG_FIELD } from './database-config-field.enum';
import { DatabaseConfigInfo } from './database-config-info';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: DatabaseConfigInfo.get(DATABASE_CONFIG_FIELD.type) as 'postgres',
  host: DatabaseConfigInfo.get(DATABASE_CONFIG_FIELD.host),
  port: Number(DatabaseConfigInfo.get(DATABASE_CONFIG_FIELD.port)),
  username: DatabaseConfigInfo.get(DATABASE_CONFIG_FIELD.username),
  password: DatabaseConfigInfo.get(DATABASE_CONFIG_FIELD.password),
  database: DatabaseConfigInfo.get(DATABASE_CONFIG_FIELD.database),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

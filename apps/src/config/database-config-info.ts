import { DATABASE_CONFIG_FIELD } from './database-config-field.enum';

export const DatabaseConfigInfo = new Map<string, string>([
  [DATABASE_CONFIG_FIELD.type, 'postgres'],
  [DATABASE_CONFIG_FIELD.host, 'localhost'],
  [DATABASE_CONFIG_FIELD.port, '5432'],
  [DATABASE_CONFIG_FIELD.username, 'postgres'],
  [DATABASE_CONFIG_FIELD.password, '@Naruto4ever'],
  [DATABASE_CONFIG_FIELD.database, 'taskmanagement'],
]);

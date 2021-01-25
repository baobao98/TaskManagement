import { v4 as uuid } from 'uuid';
export class Utils {
  static createUUID(): string {
    return uuid();
  }

  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }
}

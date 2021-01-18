import { v4 as uuid } from 'uuid';
export class Utils {
  static createUUID(): string {
    return uuid();
  }
}

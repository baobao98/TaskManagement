import * as uuid from 'uuid';

export class Utils {
  static createUUID(): string {
    return uuid();
  }
}

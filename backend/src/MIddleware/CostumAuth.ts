import { LocalSession } from "./LocalSession";

type CostumMIddleware = {
  name: string;
  status: boolean;
};

export class CostumAuth extends LocalSession {
  static listMiddleware: CostumMIddleware[] = [];

  static get(key: string): boolean {
    const costum = this.listMiddleware.find(({ name }) => name == key);
    if (costum?.status !== undefined) {
      return costum.status;
    }
    Error(`costum middleware ${key} not found`);
  }

  static register(name: string, status: (_: any) => boolean): void {
    this.listMiddleware.push({ name, status: status(super.userSession.user) });
  }
}

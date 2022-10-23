export interface FindIdByNameInterface {
  findIdByName(name: string): Promise<string | null>;
}

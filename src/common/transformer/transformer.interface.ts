import { SomeObject } from '../../types/index.js';

export interface TransformerInterface {
  transform(data: SomeObject): SomeObject;
}

import DEFAULT_STATIC_IMAGES from '../../const/default-static-images.js';
import { SomeObject } from '../../types/index.js';
import { TransformerInterface } from './transformer.interface.js';

export default class UrlPathTransformer implements TransformerInterface {
  constructor(
    private urlProperties: string[],
    private uploadPath: string,
    private staticPath: string
  ) {}

  public transform(data: SomeObject): SomeObject {
    this.transformObject(data);
    return data;
  }

  private transformObject(data: SomeObject): void {

    for (const key of Object.keys(data)) {
      if (this.urlProperties.includes(key)) { // should be string or string[]
        if (data[key] instanceof Array) {
          data[key] = (data[key] as string[]).map(this.transformURL);
        } else {
          data[key] = this.transformURL(data[key] as string);
        }
        continue;
      }

      if (typeof data[key] === 'object') {
        this.transformObject(data[key] as SomeObject);
        continue;
      }
    }
  }

  private transformURL = (value: string) => DEFAULT_STATIC_IMAGES.includes(value)
    ? `${this.staticPath}/${value}`
    : `${this.uploadPath}/${value}`;
}

export interface OfferGeneratorInterface {
  generate(count: number): Generator<string>;
}

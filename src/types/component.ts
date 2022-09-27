const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  CityServiceInterface: Symbol.for('CityServiceInterface'),
  GoodServiceInterface: Symbol.for('GoodServiceInterface'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  GoodModel: Symbol.for('GoodModel'),
  CityModel: Symbol.for('CityModel'),
  OfferModel: Symbol.for('OfferModel'),
  ImportCommand: Symbol.for('ImportCommand'),
} as const;

export default Component;

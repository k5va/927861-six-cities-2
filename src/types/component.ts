const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  CityServiceInterface: Symbol.for('CityServiceInterface'),
  GoodServiceInterface: Symbol.for('GoodServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  GoodModel: Symbol.for('GoodModel'),
  CityModel: Symbol.for('CityModel'),
} as const;

export default Component;

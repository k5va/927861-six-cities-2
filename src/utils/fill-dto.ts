import { ClassConstructor, plainToInstance } from 'class-transformer';

const fillDTO = <T, V>(dto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(dto, plainObject, {excludeExtraneousValues: true});

export default fillDTO;

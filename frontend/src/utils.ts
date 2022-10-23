import { MAX_PERCENT_STARS_WIDTH, STARS_COUNT } from './const';
import request from 'axios';
import {toast} from 'react-toastify';
import {ErrorType, ValidationErrorField} from './types/types';
import {HttpCode} from './const';


export const formatDate = (date: string) => new Intl.DateTimeFormat(
  'en-US',
  {'month':'long','year':'numeric'}
).format( new Date(date) );

export const getStarsWidth = (rating: number) =>
  `${(MAX_PERCENT_STARS_WIDTH * Math.round(rating)) / STARS_COUNT}%`;

export const getRandomElement = <T>(array: readonly T[]): T => array[Math.floor(Math.random() * array.length)];
export const pluralize = (str: string, count: number) => count === 1 ? str : `${str}s`;
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export class Token {
  private static _name = 'six-cities-auth-token';

  static get() {
    const token = localStorage.getItem(this._name);

    return token ?? '';
  }

  static save(token: string) {
    localStorage.setItem(this._name, `Bearer ${token}`);
  }

  static drop() {
    localStorage.removeItem(this._name);
  }
}

export const errorHandle = (error: ErrorType): void => {
  if (!request.isAxiosError(error)) {
    throw error;
  }

  const {response} = error;

  if (response) {
    switch (response.status) {
      case HttpCode.BadRequest:
        (response.data.details)
          ? response.data.details
            .forEach(
              (detail: ValidationErrorField) =>
                detail.messages
                  .forEach(
                    (message: string) => toast.warn(message),
                  ),
            )
          : toast.warn(response.data.message);
        break;
      case HttpCode.NoAuth:
        toast.warn(response.data.message);
        break;
      case HttpCode.NotFound:
        toast.warn(response.data.message);
        break;
      case HttpCode.Conflict:
        toast.warn(response.data.message);
        break;
    }
  }
};

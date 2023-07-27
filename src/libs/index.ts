/* eslint-disable max-len */
import BaseError from './baseError';

const asycnWrapper = (promise: Promise<any>) => promise.then((data: any) => [undefined, data]).catch((error: any) => [error]);

export { BaseError, asycnWrapper };

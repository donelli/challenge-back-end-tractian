import { isValidObjectId } from 'mongoose';

/**
 * Generates a object describing an error to send to the client
 * @param msg error message
 */
export const createError = (msg: string) => {
   return {
      message: msg
   };
}

/**
 * Checks if the given value is of a given type or throws an error
 * @param value Value to be checked
 * @param type Type to be checked against
 * @param msg Error message to be throwed if type is not equals
 */
export const isOfTypeOrError = (value: any, type: string, msg: string) => {
   if (typeof value != type) {
      throw msg;
   }
}

/**
 * Checks if the given object exists or throws an error
 * @param value Value to be checked
 * @param msg Error message to be throwed if value is not valid
 */
export const existsOrError = (value: any, msg: string) => {
   if (!value) throw msg;
   if (Array.isArray(value) && value.length === 0) throw msg;
   if (typeof value === 'string' && !value.trim()) throw msg;
}

/**
 * Checks if the given object doesn't exists or throws an error
 * @param value Value to be checked
 * @param msg Error message to be throwed if value is valid
 */
export const notExistsOrError = (value: any, msg: string) => {
   try {
      existsOrError(value, msg)
   } catch(msg) {
      return
   }
   throw msg
}

/**
 * Checks if the given object is a valid ObjectId or throws an error
 * @param objectId object to be checked
 * @param msg Error message to be throwed if value is valid
 */
export const validObjectIdOrError = (objectId: any, msg: string) => {
   if (!objectId || !isValidObjectId(objectId)) {
      throw msg;
   }
}

/**
 * Genrates a random string of a given length
 * @param length length of the random string to be generated
 */
export const generateRandomString = (length: number): string => {
   let result = "", seeds

   for (let i = 0; i < length - 1; i++) {
      //Generate seeds array, that will be the bag from where randomly select generated char
      seeds = [
         Math.floor(Math.random() * 10) + 48,
         Math.floor(Math.random() * 25) + 65,
         Math.floor(Math.random() * 25) + 97
      ]

      //Choise randomly from seeds, convert to char and append to result
      result += String.fromCharCode(seeds[Math.floor(Math.random() * 3)])
   }

   return result
}

import { createError, isOfTypeOrError, validObjectIdOrError } from './../utils';

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { findCompanyModelOrError } from './company';

const usersModelToObject = (usersModel: any) => {
   return {id: usersModel.id,
      name: usersModel.name
   }
}

const getUsersByCompanyId = async (req: Request, res: Response) => {

   const { companyId } = req.params;
   let companyModel;
   
   try {
      
      validObjectIdOrError(companyId, 'Invalid company id');

      companyModel = await findCompanyModelOrError(companyId);
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   const users = [];

   for (const user of companyModel.users) {
      users.push(usersModelToObject(user));
   }
   
   res.status(StatusCodes.OK).send({
      count: users.length,
      data: users
   });
   
};

const createUserInCompany = async (req: Request, res: Response) => {
   
   const { companyId } = req.params;
   const { name } = req.body;
   let companyModel;
   
   try {
      
      validObjectIdOrError(companyId, 'Invalid company id');
      isOfTypeOrError(name, 'string', 'Invalid user name')
      
      companyModel = await findCompanyModelOrError(companyId);
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   if (companyModel.users.find(user => user.name === name)) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('A user with this name already exists in this company'));
   }

   companyModel.users.push({
      name
   });
   
   companyModel.save()
   .then((company) => {
      
      const insertedUser = company.users[company.users.length - 1];
      
      // TODO return user object
      
      res.status(StatusCodes.OK).send({
         data: usersModelToObject(insertedUser)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error adding user'));
      
   });

};

export {
   getUsersByCompanyId,
   createUserInCompany
}

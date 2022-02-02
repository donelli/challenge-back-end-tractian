import { createError, isOfTypeOrError } from '../utils';

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { findCompanyModelOrError } from './company';

const usersModelToObject = (usersModel: any) => {
   return {
      id: usersModel.id,
      name: usersModel.name,
      createdAt: usersModel.createdAt,
      updatedAt: usersModel.updatedAt
   }
}

const findCompanyAndUserOrError = async (companyId: string, userId: string) => {
   
   const companyModel = await findCompanyModelOrError(companyId);
   
   const index = companyModel.users.findIndex(user => user.id.toString() === userId);

   if (index == -1) {
      throw 'User not found in company';
   }
   
   return { companyModel, userIndex: index };
}

const getUsersByCompanyId = async (req: Request, res: Response) => {

   const { companyId } = req.params;
   let companyModel;
   
   try {
      
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
      
      res.status(StatusCodes.OK).send({
         data: usersModelToObject(insertedUser)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error adding user'));
      
   });

};

const getUserById = async (req: Request, res: Response) => {
   
   const { companyId, userId } = req.params;
   let companyModel, userIndex;
   
   try {
      
      const res = await findCompanyAndUserOrError(companyId, userId);
      companyModel = res.companyModel;
      userIndex = res.userIndex;
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }

   const user = companyModel.users[userIndex];
   
   res.status(StatusCodes.OK).send({
      data: usersModelToObject(user)
   });
   
}

const deleteUser = async (req: Request, res: Response) => {
   
   const { companyId, userId } = req.params;
   let companyModel, userIndex;
   
   try {
      
      const res = await findCompanyAndUserOrError(companyId, userId);
      companyModel = res.companyModel;
      userIndex = res.userIndex;
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }

   companyModel.users.splice(userIndex, 1);
   
   companyModel.save()
   .then(() => {
      
      res.sendStatus(StatusCodes.OK);
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error deleting user'));
      
   });

}

const updateUser = async (req: Request, res: Response) => {
   
   const { companyId, userId } = req.params;
   const { name } = req.body;
   let companyModel, userIndex;
   
   try {
      
      isOfTypeOrError(name, 'string', 'Invalid user name')
      
      const res = await findCompanyAndUserOrError(companyId, userId);
      companyModel = res.companyModel;
      userIndex = res.userIndex;
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   let userNameIndex = companyModel.users.findIndex(user => user.name === name);
   
   if (userNameIndex != -1 && userNameIndex != userIndex) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('A user with this name already exists in this company'));
   }
   
   companyModel.users[userIndex].name = name;
   
   companyModel.save()
   .then((company) => {
      
      const updatedUser = company.users.find(user => user.id.toString() === userId);
      
      res.status(StatusCodes.OK).send({
         data: usersModelToObject(updatedUser)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error updating user'));
      
   });

}

export {
   getUsersByCompanyId,
   createUserInCompany,
   getUserById,
   deleteUser,
   updateUser,

   findCompanyAndUserOrError
}

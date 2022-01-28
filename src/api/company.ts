import { createError, existsOrError, isOfTypeOrError } from './../utils';

import { Request, Response } from 'express'
import { CompanyModel } from '../models/company'
import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

const companyModelToObject = (companyModel: any) => {
   return {
      id: companyModel.id,
      name: companyModel.name
   }
}

const getAllCompanies = async (req: Request, res: Response) => {
   
   const companiesModel = await CompanyModel.find();
   
   const companies = [];

   for (const companyModel of companiesModel) {
      companies.push(companyModelToObject(companyModel));
   }
   
   res.status(StatusCodes.OK).send({
      count: companies.length,
      data: companies
   });
}

const createCompany = async (req: Request, res: Response) => {

   const { name } = req.body;
   
   try {
      isOfTypeOrError(name, 'string', 'Invalid company name')
      existsOrError(name, 'Invalid company name');
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   const companyModel = await CompanyModel.findOne({ name: name });
   if (companyModel) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('A company with this name already exists'));
   }

   const company = new CompanyModel({
      name: name,
   });
   
   const response = await company.save();
   
   res.status(StatusCodes.CREATED).send({
      data: companyModelToObject(response)
   });
};

const getCompanyById = async (req: Request, res: Response) => {

   const { id } = req.params;
   
   try {
      isOfTypeOrError(id, 'string', 'Invalid company id')
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('Invalid company id'));
   }
   
   const companyModel = await CompanyModel.findById(id);

   if (!companyModel) {
      return res.status(StatusCodes.NOT_FOUND).send(createError('Company not found'));
   }
   
   const companyObject = companyModelToObject(companyModel);

   res.status(StatusCodes.OK).send({
      data: companyObject
   })
};

const updateCompany = (req: Request, res: Response) => {
   res.send('TODO create company by id: ' + req.params.id)
};

const deleteCompany = async (req: Request, res: Response) => {
  
   const { id } = req.params;
   
   try {
      isOfTypeOrError(id, 'string', 'Invalid company id')
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   if (!isValidObjectId(id)) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('Invalid company id'));
   }
   
   const companyModel = await CompanyModel.findById(id);

   if (!companyModel) {
      return res.status(StatusCodes.NOT_FOUND).send(createError('Company not found'));
   }

   // TODO check if company has users
   // TODO check if company has units
   
   try {
      await companyModel.remove();
   } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send(createError('Error deleting company'));
   }
   
   res.sendStatus(StatusCodes.OK);
};

export {
   getAllCompanies,
   createCompany,
   getCompanyById,
   updateCompany,
   deleteCompany
}

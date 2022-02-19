import { createError, existsOrError, isOfTypeOrError, validObjectIdOrError } from '../utils';

import { Request, Response } from 'express'
import { CompanyModel } from '../models/company'
import { StatusCodes } from 'http-status-codes';

const companyModelToObject = (companyModel: any) => {
   return {
      id: companyModel.id,
      name: companyModel.name,
      userCount: companyModel.users?.length,
      unitCount: companyModel.units?.length,
      createdAt: companyModel.createdAt,
      updatedAt: companyModel.updatedAt
   }
}

const findCompanyModelOrError = async (companyId: string) => {

   validObjectIdOrError(companyId, StatusCodes.BAD_REQUEST, 'Invalid company id');
   
   const companyModel = await CompanyModel.findById(companyId);

   if (!companyModel) {
      throw [ StatusCodes.NOT_FOUND, 'Company not found' ];
   }
   
   return companyModel;
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
      isOfTypeOrError(name, 'string', StatusCodes.BAD_REQUEST, 'Invalid company name')
      existsOrError(name, StatusCodes.BAD_REQUEST, 'Invalid company name');
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
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
   let companyModel;
   
   try {
      
      companyModel = await findCompanyModelOrError(id);
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }
   
   res.status(StatusCodes.OK).send({
      data: companyModelToObject(companyModel)
   })
};

const updateCompany = async (req: Request, res: Response) => {
   
   const { id } = req.params;
   const { name } = req.body;
   
   let companyModel;
   
   try {
      
      isOfTypeOrError(name, 'string', StatusCodes.BAD_REQUEST, 'Invalid company name')
      existsOrError(name, StatusCodes.BAD_REQUEST, 'Invalid company name');
      
      companyModel = await findCompanyModelOrError(id);
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }
   
   const companyNameModel = await CompanyModel.findOne({ name: name });
   if (companyNameModel && companyNameModel.id !== id) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('A company with this name already exists'));
   }
   
   companyModel.name = name;
   
   companyModel.save()
   .then((company) => {
      
      res.status(StatusCodes.OK).send({
         data: companyModelToObject(company)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error saving company'));
      
   });
   
}

const deleteCompany = async (req: Request, res: Response) => {
  
   const { id } = req.params;
   let companyModel;
   
   try {
      
      companyModel = await findCompanyModelOrError(id);

      if (companyModel.units.length > 0) {
         throw [StatusCodes.BAD_REQUEST, 'This company has units, please remove them first'];
      }
      
      if (companyModel.users.length > 0) {
         throw [StatusCodes.BAD_REQUEST, 'This company has users, please remove them first'];
      }
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }
   
   try {
      await companyModel.remove();
   } catch (err) {
      console.error(err);
      res.status(StatusCodes.BAD_REQUEST).send(createError('Error deleting company'));
   }
   
   res.status(StatusCodes.OK).send({});
};

export {
   getAllCompanies,
   createCompany,
   getCompanyById,
   updateCompany,
   deleteCompany,

   findCompanyModelOrError
}

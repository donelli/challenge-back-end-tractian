import { createError, existsOrError, isOfTypeOrError } from './../utils';

import { Request, Response } from 'express'
import { CompanyModel } from '../models/company'

const companyModelToObject = (companyModel: any) => {
   return {
      id: companyModel._id,
      name: companyModel.name
   }
}

const getAllCompanies = async (req: Request, res: Response) => {
   
   const companiesModel = await CompanyModel.find();
   
   const companies = [];

   for (const companyModel of companiesModel) {
      companies.push(companyModelToObject(companyModel));
   }
   
   res.send({
      count: companies.length,
      companies
   });
}

const createCompany = async (req: Request, res: Response) => {
   
   console.log(req.body);
   
   if (!req.body) {
      return res.status(400).send(createError(1, 'Invalid company data'));
   }

   try {
      isOfTypeOrError(req.body.name, 'string', 'Invalid company name')
      existsOrError(req.body.name, 'Invalid company name');
   } catch (error) {
      return res.status(400).send(createError(2, error));
   }
   
   const name = req.body.name;
   
   const companyModel = await CompanyModel.findOne({ name: name });
   if (companyModel) {
      return res.status(400).send(createError(3, 'A company with this name already exists'));
   }

   const company = new CompanyModel({
      name: name,
   });
   
   const response = await company.save();
   
   res.send(companyModelToObject(response));
};

const getCompanyById = (req: Request, res: Response) => {
   res.send('TODO get company by id: ' + req.params.id)
};

const updateCompany = (req: Request, res: Response) => {
   res.send('TODO create company by id: ' + req.params.id)
};

const deleteCompany = (req: Request, res: Response) => {
   res.send('TODO delete company by id: ' + req.params.id)
};

export {
   getAllCompanies,
   createCompany,
   getCompanyById,
   updateCompany,
   deleteCompany
}

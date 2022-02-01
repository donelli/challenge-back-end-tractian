import { createError, isOfTypeOrError } from '../utils';

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { findCompanyModelOrError } from './company';

const unitModelToObject = (unitModel: any) => {
   return {
      id: unitModel.id,
      name: unitModel.name,
      assetCount: unitModel.assets?.length,
   }
}

const findCompanyAndUnitOrError = async (companyId: string, unitId: string) => {
   
   const companyModel = await findCompanyModelOrError(companyId);
   
   const index = companyModel.units.findIndex(unit => unit.id.toString() === unitId);

   if (index == -1) {
      throw 'Unit not found in company';
   }
   
   return { companyModel, unitIndex: index };
}

const getUnitsByCompanyId = async (req: Request, res: Response) => {
   
   const { companyId } = req.params;
   let companyModel;
   
   try {
      
      companyModel = await findCompanyModelOrError(companyId);
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   const units = [];

   for (const unit of companyModel.units) {
      units.push(unitModelToObject(unit));
   }
   
   res.status(StatusCodes.OK).send({
      count: units.length,
      data: units
   });
   
};

const createUnitInCompany = async (req: Request, res: Response) => {
   
   const { companyId } = req.params;
   const { name } = req.body;
   let companyModel;
   
   try {
      
      isOfTypeOrError(name, 'string', 'Invalid unit name')
      
      companyModel = await findCompanyModelOrError(companyId);
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   if (companyModel.units.find(unit => unit.name === name)) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('A unit with this name already exists in this company'));
   }
   
   companyModel.units.push({
      name,
      assets: []
   });
   
   companyModel.save()
   .then((company) => {

      const insertedUnit = company.units[company.units.length - 1];
      
      res.status(StatusCodes.OK).send({
         data: unitModelToObject(insertedUnit)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error adding unit'));
      
   });

};

const getUnitById = async (req: Request, res: Response) => {
   
   const { companyId, unitId } = req.params;
   let companyModel, unitIndex;
   
   try {
      
      const res = await findCompanyAndUnitOrError(companyId, unitId);
      companyModel = res.companyModel;
      unitIndex = res.unitIndex;
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }

   const unit = companyModel.units[unitIndex];
   
   res.status(StatusCodes.OK).send({
      data: unitModelToObject(unit)
   });
   
};

const deleteUnit = async (req: Request, res: Response) => {
   
   const { companyId, unitId } = req.params;
   let companyModel, unitIndex;
   
   try {
      
      const res = await findCompanyAndUnitOrError(companyId, unitId);
      companyModel = res.companyModel;
      unitIndex = res.unitIndex;
      
      if (companyModel.units[unitIndex].assets.length > 0) {
         throw 'This unit has assets, please remove them first';
      }
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }

   companyModel.units.splice(unitIndex, 1);
   
   companyModel.save()
   .then(() => {
      
      res.sendStatus(StatusCodes.OK);
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error deleting unit'));
      
   });

};

const updateUnit = async (req: Request, res: Response) => {
   
   const { companyId, unitId } = req.params;
   const { name } = req.body;
   let companyModel, unitIndex;
   
   try {
      
      isOfTypeOrError(name, 'string', 'Invalid unit name')
      
      const res = await findCompanyAndUnitOrError(companyId, unitId);
      companyModel = res.companyModel;
      unitIndex = res.unitIndex;
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
   let unitNameIndex = companyModel.units.findIndex(unit => unit.name === name);
   
   if (unitNameIndex != -1 && unitNameIndex != unitIndex) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError('A unit with this name already exists in this company'));
   }
   
   companyModel.units[unitIndex].name = name;
   
   companyModel.save()
   .then((company) => {
      
      const updatedUnit = company.units.find(unit => unit.id.toString() === unitId);
      
      res.status(StatusCodes.OK).send({
         data: unitModelToObject(updatedUnit)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error updating unit'));
      
   });

};

export {
   getUnitsByCompanyId,
   createUnitInCompany,
   getUnitById,
   deleteUnit,
   updateUnit,

   findCompanyAndUnitOrError,
   unitModelToObject
}

import { createError, existsOrError, isOfTypeOrError } from '../utils';

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { uploadFile } from '../middlewares/upload';
import { findCompanyAndUnitOrError, unitModelToObject } from './unit';
import { findCompanyAndUserOrError } from './user';
import { existsSync } from 'fs';
import path = require('path');
import { AssetStatus } from '../models/asset';
import { findCompanyModelOrError } from './company';
import { storeFileAtBucket, deleteFileFromBucket, checkIfFileExistsInBucket } from '../config/s3-bucket';

const assetFileNameToUrl = (fileName: string) => {
   return process.env.AWS_BUCKET_BASE_URL + (process.env.AWS_BUCKET_BASE_URL.endsWith('/') ? '': '/') + fileName
}

const assetModelToObject = (assetModel: any) => {
   return {
      id: assetModel._id,
      name: assetModel.name,
      description: assetModel.description,
      model: assetModel.model,
      owner: assetModel.owner,
      image: assetFileNameToUrl(assetModel.image),
      imageId: assetModel.image,
      health_level: assetModel.health_level,
      status: assetModel.status,
      createdAt: assetModel.createdAt,
      updatedAt: assetModel.updatedAt,
      unit: assetModel.unit ? unitModelToObject(assetModel.unit) : undefined
   }
}

const findAssetInCompanyAndUnitOrError = async (companyId: string, unitId: string, assetId: string) => {
   
   const res = await findCompanyAndUnitOrError(companyId, unitId);
   
   const companyModel = res.companyModel;
   const unitIndex = res.unitIndex;
   
   const assetIndex = companyModel.units[unitIndex].assets.findIndex(asset => asset._id.toString() == assetId);
   
   if (assetIndex == -1) {
      throw [StatusCodes.NOT_FOUND, 'Asset not found in company and unit'];
   }

   return {
      companyModel,
      unitIndex,
      assetIndex
   }
   
}

const uploadAssetImage = async (req: Request, res: Response) => {
   
   try {
      
      await uploadFile(req, res);
      
      if (req.file == undefined) {
         return res.status(StatusCodes.BAD_REQUEST).send(createError('No file was provided!'));
      }
      
      await storeFileAtBucket(req.file.filename, path.join('./public/uploads/', req.file.filename) )
      
      res.status(200).send({
         fileName: req.file.filename,
         fileUrl: assetFileNameToUrl(req.file.filename)
      });
      
   } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError(`Could not upload the file: ${err.message}`));
   }
   
}

const getAssetsByCompanyAndUnitId = async (req: Request, res: Response) => {
   
   const { companyId, unitId } = req.params;
   let companyModel, unitIndex: number;
   
   try {
      
      const resp = await findCompanyAndUnitOrError(companyId, unitId);
      
      companyModel = resp.companyModel;
      unitIndex = resp.unitIndex;
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }
   
   const assets = [];

   for (const asset of companyModel.units[unitIndex].assets) {
      assets.push(assetModelToObject(asset));
   }
   
   res.status(StatusCodes.OK).send({
      count: assets.length,
      data: assets
   });
   
}

const validateAsset = async (companyId: any, body: any) => {
   
   existsOrError(body.name, StatusCodes.BAD_REQUEST, 'Invalid asset name!');
   existsOrError(body.description, StatusCodes.BAD_REQUEST, 'Invalid asset description!');
   existsOrError(body.model, StatusCodes.BAD_REQUEST, 'Invalid asset model!');
   existsOrError(body.ownerId, StatusCodes.BAD_REQUEST, 'Invalid asset ownerId!');
   existsOrError(body.imageId, StatusCodes.BAD_REQUEST, 'Invalid asset imageId!');
   isOfTypeOrError(body.healthLevel, 'number', StatusCodes.BAD_REQUEST, 'Invalid health level!');
   isOfTypeOrError(body.status, 'string', StatusCodes.BAD_REQUEST, 'Invalid asset status!');
   
   try {
      await findCompanyAndUserOrError(companyId, body.ownerId);
   } catch (error) {
      throw [StatusCodes.NOT_FOUND, 'Owner not found in company'];
   }
   
   const err = await checkIfFileExistsInBucket(body.imageId);
   
   if (err) {
      
      if (err.includes('INTERNAL ERROR')) {
         throw [StatusCodes.INTERNAL_SERVER_ERROR, err];
      } else {
         throw [StatusCodes.NOT_FOUND, err];
      }
      
   }
   
   if (body.healthLevel < 0 || body.healthLevel > 100) {
      throw [StatusCodes.BAD_REQUEST, 'Invalid health level, must be between 0 and 100'];
   }
   
   if (!Object.values(AssetStatus).includes(body.status)) {
      throw [StatusCodes.BAD_REQUEST, 'Invalid status. Must be one of: ' + Object.values(AssetStatus).join(', ')];
   }
   
}

const createAsset = async (req: Request, res: Response) => {
   
   const { companyId, unitId } = req.params;
   let companyModel, unitIndex: number;
   
   try {
      
      const res = await findCompanyAndUnitOrError(companyId, unitId);
      companyModel = res.companyModel;
      unitIndex = res.unitIndex;

      await validateAsset(companyId, req.body);

   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }

   const { name, description, model, ownerId, imageId, healthLevel, status } = req.body;
   
   companyModel.units[unitIndex].assets.push({
      name,
      description,
      model,
      owner: ownerId,
      image: imageId,
      health_level: healthLevel,
      status: status,
   });
   
   companyModel.save()
   .then((company) => {
      
      const unit = company.units[unitIndex];
      const insertedAsset = unit.assets[unit.assets.length - 1];
      
      res.status(StatusCodes.OK).send({
         data: assetModelToObject(insertedAsset)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error adding asset'));
      
   });
   
}

const getAssetById = async (req: Request, res: Response) => {
   
   const { companyId, unitId, assetId } = req.params;
   let companyModel, unitIndex: number, assetIndex: number;
   
   try {
      
      const resp = await findAssetInCompanyAndUnitOrError(companyId, unitId, assetId);
      
      ({companyModel, unitIndex, assetIndex} = resp);
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }
   
   res.status(StatusCodes.OK).send({
      data: assetModelToObject(companyModel.units[unitIndex].assets[assetIndex])
   });
   
}

const deleteAsset = async (req: Request, res: Response) => {
   
   const { companyId, unitId, assetId } = req.params;
   let companyModel, unitIndex: number, assetIndex: number;
   
   try {
      
      const resp = await findAssetInCompanyAndUnitOrError(companyId, unitId, assetId);
      ({companyModel, unitIndex, assetIndex} = resp);
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[0]));
   }

   const assetImageFileName = companyModel.units[unitIndex].assets[assetIndex].image;
   
   companyModel.units[unitIndex].assets.splice(assetIndex, 1);

   companyModel.save()
   .then(async (company) => {
      
      deleteFileFromBucket(assetImageFileName)
      .finally(() => {
         res.status(StatusCodes.OK).send({});
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error deleting asset'));
      
   });
   
}

const updateAsset = async (req: Request, res: Response) => {
   
   const { companyId, unitId, assetId } = req.params;
   let companyModel, unitIndex: number, assetIndex: number;
   
   try {
      
      const resp = await findAssetInCompanyAndUnitOrError(companyId, unitId, assetId);
      ({companyModel, unitIndex, assetIndex} = resp);
      
      await validateAsset(companyId, req.body);

   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }

   const { name, description, model, ownerId, imageId, healthLevel, status } = req.body;
   
   const asset = companyModel.units[unitIndex].assets[assetIndex];

   asset.name = name;
   asset.description = description;
   asset.model = model;
   asset.owner = ownerId;
   asset.image = imageId;
   asset.health_level = healthLevel;
   asset.status = status;
   
   companyModel.save()
   .then((company) => {
      
      const unit = company.units[unitIndex];
      const updatedAsset = unit.assets.find(asset => asset._id.toString() == assetId);
      
      res.status(StatusCodes.OK).send({
         data: assetModelToObject(updatedAsset)
      });
      
   })
   .catch(err => {
      
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError('Error updating asset'));
      
   });
   
}

const getAllAssetsFromCompany = async (req: Request, res: Response) => {
   
   const { companyId } = req.params;
   let companyModel;
   
   try {
      
      companyModel = await findCompanyModelOrError(companyId);
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }

   const assets = [];
   
   for (const unit of companyModel.units) {
      for (const asset of unit.assets) {
         asset.unit = unit;
         assets.push(asset);
      }
   }
   
   res.status(StatusCodes.OK).send({
      count: assets.length, 
      data: assets.map(asset => assetModelToObject(asset))
   });
}

const getSummaryOfAssetsStatus = async (req: Request, res: Response) => {
   
   const { companyId } = req.params;
   let companyModel;
   
   try {
      
      companyModel = await findCompanyModelOrError(companyId);
      
   } catch (error) {
      return res.status(error[0]).send(createError(error[1]));
   }

   const assetsStatus = [];
   
   for (const unit of companyModel.units) {
      for (const asset of unit.assets) {
         
         const statusIndex = assetsStatus.findIndex(statusObj => statusObj.status == asset.status);
         
         if (statusIndex < 0) {
            assetsStatus.push({
               status: asset.status,
               count: 1
            });
         } else {
            assetsStatus[statusIndex].count++;
         }
         
      }
   }
   
   res.status(StatusCodes.OK).send({
      count: assetsStatus.length, 
      data: assetsStatus
   });
}

export {
   uploadAssetImage,
   getAssetsByCompanyAndUnitId,
   getAllAssetsFromCompany,
   getSummaryOfAssetsStatus,
   createAsset,
   getAssetById,
   deleteAsset,
   updateAsset
}
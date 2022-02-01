import { createError, existsOrError, isOfTypeOrError } from '../utils';

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { findCompanyModelOrError } from './company';
import { uploadFile } from '../middlewares/upload';
import * as url from 'url';
import { findCompanyAndUnitOrError } from './unit';
import { findCompanyAndUserOrError } from './user';
import { existsSync } from 'fs';
import path = require('path');
import { AssetStatus } from '../models/asset';

const assetModelToObject = (assetModel: any) => {
   return {
      id: assetModel._id,
      name: assetModel.name,
      description: assetModel.description,
      model: assetModel.model,
      owner: assetModel.owner,
      image: assetModel.image,
      health_level: assetModel.health_level,
      status: assetModel.status
   }
}

const uploadAssetImage = async (req: Request, res: Response) => {
   
   try {
      
      await uploadFile(req, res);
      
      if (req.file == undefined) {
         return res.status(StatusCodes.BAD_REQUEST).send(createError('No file was provided!'));
      }
      
      res.status(200).send({
         fileName: req.file.filename,
         fileUrl: process.env.API_BASE_URL + (process.env.API_BASE_URL.endsWith('/') ? '': '/') + "uploads/" + req.file.filename
      });
      
   } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(createError(`Could not upload the file: ${err.message}`));
   }
   
}

const getAssetsByCompanyAndUnitId = async (req: Request, res: Response) => {
   res.send("not implemented yet");
}

const createAsset = async (req: Request, res: Response) => {
   
   const { name, description, model, ownerId, imageId, healthLevel, status } = req.body;
   const { companyId, unitId } = req.params;
   let companyModel, unitIndex: number;
   
   try {
      
      const res = await findCompanyAndUnitOrError(companyId, unitId);
      companyModel = res.companyModel;
      unitIndex = res.unitIndex;

      existsOrError(name, 'Invalid asset name!');
      existsOrError(description, 'Invalid asset description!');
      existsOrError(model, 'Invalid asset model!');
      existsOrError(ownerId, 'Invalid asset ownerId!');
      existsOrError(imageId, 'Invalid asset imageId!');
      isOfTypeOrError(healthLevel, 'number', 'Invalid health level!');
      existsOrError(status, 'Invalid asset status!');
      
      try {
         await findCompanyAndUserOrError(companyId, ownerId);
      } catch (error) {
         throw 'Owner not found in company';
      }
      
      if (!existsSync(path.join(__dirname, '../../public/uploads/' + imageId))) {
         throw 'Asset image not found';
      }
      
      if (healthLevel < 0 || healthLevel > 100) {
         throw 'Invalid health level, must be between 0 and 100';
      }
      
      if (!Object.values(AssetStatus).includes(status)) {
         throw 'Invalid status. Must be one of: ' + Object.values(AssetStatus).join(', ');
      }
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
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
   res.send("not implemented yet");
}

const deleteAsset = async (req: Request, res: Response) => {
   res.send("not implemented yet");
}

const updateAsset = async (req: Request, res: Response) => {
   res.send("not implemented yet");
}

const getAllAssetsFromCompany = async (req: Request, res: Response) => {
   res.send("not implemented yet");
}

export {
   uploadAssetImage,
   getAssetsByCompanyAndUnitId,
   getAllAssetsFromCompany,
   createAsset,
   getAssetById,
   deleteAsset,
   updateAsset
}
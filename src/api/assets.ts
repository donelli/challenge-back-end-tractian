import { createError, existsOrError, isOfTypeOrError } from './../utils';

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { findCompanyModelOrError } from './company';
import { uploadFile } from '../middlewares/upload';
import * as url from 'url';
import { findCompanyAndUnitOrError } from './unit';

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

// TODO validate health_level: mongoose have somenthing that i can use

const createAsset = async (req: Request, res: Response) => {
   
   const { name, description, model, ownerId, imageId } = req.body;
   const { companyId, unitId } = req.params;
   let companyModel, unitIndex;
   
   try {
      
      const res = await findCompanyAndUnitOrError(companyId, unitId);
      companyModel = res.companyModel;
      unitIndex = res.unitIndex;

      existsOrError(name, 'Invalid asset name!');
      existsOrError(description, 'Invalid asset description!');
      existsOrError(model, 'Invalid asset model!');
      existsOrError(ownerId, 'Invalid asset ownerId!');
      existsOrError(imageId, 'Invalid asset imageId!');
      
   } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).send(createError(error));
   }
   
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
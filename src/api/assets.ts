import { createError, isOfTypeOrError } from './../utils';

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes';
import { findCompanyModelOrError } from './company';
import { uploadFile } from '../middlewares/upload';
import * as url from 'url';

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

export {
   uploadAssetImage
}
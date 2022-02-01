import { Request, Response, Router } from 'express'
import path = require('path');
import { createAsset, deleteAsset, getAssetById, getAssetsByCompanyAndUnitId, updateAsset, uploadAssetImage } from './api/asset';
import { getAllCompanies, createCompany, getCompanyById, updateCompany, deleteCompany } from './api/company'
import { createUnitInCompany, deleteUnit, getUnitById, getUnitsByCompanyId, updateUnit } from './api/unit';
import { createUserInCompany, deleteUser, getUserById, getUsersByCompanyId, updateUser } from './api/user';

const router = Router()

// Company routes

router.route('/companies')
.get(getAllCompanies)
.post(createCompany)

router.route('/companies/:id')
.get(getCompanyById)
.put(updateCompany)
.delete(deleteCompany);

// User routes

router.route('/companies/:companyId/users')
.get(getUsersByCompanyId)
.post(createUserInCompany);

router.route('/companies/:companyId/users/:userId')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

// Unit routes

router.route('/companies/:companyId/units')
.get(getUnitsByCompanyId)
.post(createUnitInCompany);

router.route('/companies/:companyId/units/:unitId')
.get(getUnitById)
.put(updateUnit)
.delete(deleteUnit);

// Asset routes

router.post('/uploadAssetImage', uploadAssetImage);

router.route('/companies/:companyId/units/:unitId/assets')
.get(getAssetsByCompanyAndUnitId)
.post(createAsset);

router.route('/companies/:companyId/units/:unitId/assets/:assetId')
.get(getAssetById)
.put(updateAsset)
.delete(deleteAsset);

export { router as mainRouter }
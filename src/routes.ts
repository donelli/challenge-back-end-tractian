import { Router } from 'express'
import { getAllCompanies, createCompany, getCompanyById, updateCompany, deleteCompany } from './api/company'
import { createUserInCompany, deleteUser, getUserById, getUsersByCompanyId, updateUser } from './api/user';

const router = Router()

router.route('/companies')
.get(getAllCompanies)
.post(createCompany)

router.route('/companies/:id')
.get(getCompanyById)
.put(updateCompany)
.delete(deleteCompany);

router.route('/companies/:companyId/users')
.get(getUsersByCompanyId)
.post(createUserInCompany);

router.route('/companies/:companyId/users/:userId')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

export { router as mainRouter }
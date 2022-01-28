import { Router } from 'express'
import { getAllCompanies, createCompany, getCompanyById, updateCompany, deleteCompany, getUsersByCompanyId, createUserInCompany } from '../api/company'

const router = Router()

router.route('/')
.get(getAllCompanies)
.post(createCompany)

router.route('/:id')
.get(getCompanyById)
.put(updateCompany)
.delete(deleteCompany);

router.route('/:companyId/users')
.get(getUsersByCompanyId)
.post(createUserInCompany);

export { router as companyRouter }
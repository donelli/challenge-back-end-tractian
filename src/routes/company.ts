import { Router, Request, Response } from 'express'
import { getAllCompanies, createCompany, getCompanyById, updateCompany, deleteCompany } from '../api/company'

const router = Router()

router.route('/')
.get(getAllCompanies)
.post(createCompany)

router.route('/:id')
.get(getCompanyById)
.put(updateCompany)
.delete(deleteCompany);

export { router as companyRouter }
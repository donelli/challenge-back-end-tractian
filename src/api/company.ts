
import { Request, Response } from 'express'

const getAllCompanies = (req: Request, res: Response) => {
   res.send('TODO get all companies')
}

const createCompany = (req: Request, res: Response) => {
   res.send('TODO create company')
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

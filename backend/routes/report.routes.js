import express from 'express';
import { createReport, getReports, updateReportStatus } from '../controllers/report.controllers.js';
import isAuth from '../middlewares/isAuth.js';
const reportRouter = express.Router();

reportRouter.post('/', isAuth, createReport);
reportRouter.get('/', getReports);
reportRouter.patch('/:id/status', isAuth, updateReportStatus);

export default reportRouter;
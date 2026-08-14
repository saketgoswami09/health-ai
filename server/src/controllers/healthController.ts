import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/reportService';
import { ReportRequest, ReportResponse } from '../types';
import { logger } from '../utils/logger';

export class HealthController {
  
  public getHealth = (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Server is running normally.' });
  };

  public generateReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportRequest = req.body as ReportRequest;
      
      if (!reportRequest || !reportRequest.sessionId || !reportRequest.conversationData) {
        return res.status(400).json({ success: false, message: 'Invalid request data' });
      }

      const report = await reportService.createReport(reportRequest);
      
      const response: ReportResponse = {
        success: true,
        data: report,
        message: 'Report generated successfully'
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export const healthController = new HealthController();

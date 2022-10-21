import { NextFunction, Request, Response } from 'express';
import { nanoid} from 'nanoid';
import multer, { diskStorage } from 'multer';
import { MiddlewareInterface } from './middleware.interface.js';
import mime from 'mime-types';

export default class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private isMultiple: boolean = false
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }
    });

    if (!this.isMultiple) {
      const uploadSingleFileMiddleware = multer({storage}).single(this.fieldName);
      uploadSingleFileMiddleware(req, res, next);
    } else {
      const uploadMultiFileMiddleware = multer({storage}).array(this.fieldName);
      uploadMultiFileMiddleware(req, res, next);
    }
  }
}

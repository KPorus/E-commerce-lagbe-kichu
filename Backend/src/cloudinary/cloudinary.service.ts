import { BadRequestException, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import * as toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new BadRequestException('No file provided'));
      }
      if (!file.buffer) {
        return reject(new BadRequestException('File buffer is empty'));
      }
      // console.log(file.buffer);
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) {
            throw new BadRequestException(error.message);
          }
          if (!result) {
            return reject(
              new BadRequestException(
                'Cloudinary upload failed with no result.',
              ),
            );
          }
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'video',
        },
        (error: UploadApiErrorResponse, result?: any) => {
          if (error) {
            return reject(new BadRequestException(error.message));
          }
          if (!result) {
            return reject(
              new BadRequestException(
                'Cloudinary upload failed with no result.',
              ),
            );
          }
          resolve(result.secure_url);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}

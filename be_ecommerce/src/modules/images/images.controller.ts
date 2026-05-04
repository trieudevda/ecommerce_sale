import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ImageRefTypeEnum } from './enum/images.enum';

@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const refType = req.body.refType || 'other';

          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');

          const uploadPath = join(
            process.cwd(),
            'uploads',
            refType,
            String(year),
            month,
            day,
          );

          // tạo folder nếu chưa có
          fs.mkdirSync(uploadPath, { recursive: true });

          cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),

      // 🔥 validate file
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files'), false);
        }
        cb(null, true);
      },

      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const { refId, refType } = body;
    const r = '1';
    const c = ImageRefTypeEnum.PRODUCT;
    // convert path → url
    const relativePath = file.path.replace(/\\/g, '/');
    const url = `/uploads/${relativePath.split('uploads/')[1]}`;
    console.log(url, refId, refType, relativePath, url);
    return this.imageService.create({
      url,
      refId: Number(r),
      refType: c,
      // refId: Number(refId),
      // refType,
      isPrimary: true,
    });
  }
  @Post('upload-multiple')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: (req: any, file, cb) => {
            const refType = req.body.refType || 'other';

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');

            const uploadPath = join(
              process.cwd(),
              'uploads',
              refType,
              String(year),
              month,
              day,
            );

            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async uploadMultiple(
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
    @Body() body: any,
  ) {
    // if (!files || files.length === 0) {
    //   throw new BadRequestException('Không có file nào được tải lên');
    // }
    if (!body.refId) {
      throw new BadRequestException('Thiếu refId để liên kết hình ảnh');
    }
    return this.imageService.createMany(
      files,
      Number(body.refId),
      body.refType || 'other',
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.delete(id);
  }
  @Delete()
  deleteMany(@Body('ids') ids: number[]) {
    return this.imageService.deleteMany(ids);
  }
}

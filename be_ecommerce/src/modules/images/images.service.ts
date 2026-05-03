import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import * as fs from 'fs';
import { ImageRefTypeEnum } from './enum/images.enum';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private repo: Repository<Image>,
  ) { }

  create(data: Partial<Image>) {
    return this.repo.save(data);
  }

  findByRef(refId: number, refType: ImageRefTypeEnum) {
    return this.repo.find({
      where: { refId, refType },
      order: { sortOrder: 'ASC' },
    });
  }

  async setPrimary(id: number) {
    const image = await this.repo.findOneBy({ id });

    if (!image) throw new Error('Image not found');

    await this.repo.update(
      { refId: image.refId, refType: image.refType },
      { isPrimary: false },
    );
    image.isPrimary = true;
    return this.repo.save(image);
  }
  async createMany(
    files: { avatar?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
    refId: number,
    refType: ImageRefTypeEnum) {
    const imageData: Image[] = [];
    if (files.avatar && files.avatar.length > 0) {
      const avatarFile = files.avatar[0];
      const relativePath = avatarFile.path.replace(/\\/g, '/');

      imageData.push(this.repo.create({
        url: `/${relativePath.split('uploads/')[1]}`,
        refId: refId,
        refType: refType,
        sortOrder: 0,
        isPrimary: true,
      }));
    }
    if (files.gallery && files.gallery.length > 0) {
      files.gallery.forEach((file, index) => {
        const relativePath = file.path.replace(/\\/g, '/');

        imageData.push(this.repo.create({
          url: `/${relativePath.split('uploads/')[1]}`,
          refId: refId,
          refType: refType,
          sortOrder: index + 1,
        }));
      });
    }
    if (imageData.length > 0) {
      return await this.repo.save(imageData);
    }
    return [];
  }

  async delete(id: number) {
    const image = await this.repo.findOneBy({ id });

    if (!image) {
      throw new Error('Image not found');
    }

    // 🔥 path vật lý
    const filePath = `./uploads/${image.url.replace('/uploads/', '')}`;

    // 🔥 xoá file nếu tồn tại
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 🔥 xoá DB
    await this.repo.delete(id);

    return { message: 'Deleted successfully' };
  }
  async deleteMany(ids: number[]) {
    const images = await this.repo.findBy({ id: In(ids) });

    for (const img of images) {
      const filePath = `./uploads/${img.url.replace('/uploads/', '')}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.repo.delete(ids);

    return { message: 'Deleted many successfully' };
  }
}

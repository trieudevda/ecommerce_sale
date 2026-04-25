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
  ) {}

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

    // reset ảnh cũ
    await this.repo.update(
      { refId: image.refId, refType: image.refType },
      { isPrimary: false },
    );

    // set ảnh mới
    image.isPrimary = true;
    return this.repo.save(image);
  }
  async createMany(data: Partial<Image>[]) {
    return this.repo.save(data);
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

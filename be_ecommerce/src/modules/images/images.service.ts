import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import * as fs from 'fs';
import { ImageRefTypeEnum } from './enum/images.enum';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
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

  async updateImages(
    files: {
      avatar?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
    refId: number,
    refType: ImageRefTypeEnum,
    existingAvatarId?: number,
    existingGalleryIds: number[] = [],
  ) {
    const oldImages = await this.repo.find({
      where: { refId, refType },
    });
    const oldAvatar = oldImages.find((x) => x.isPrimary);
    if (
      oldAvatar &&
      (existingAvatarId && oldAvatar.id !== existingAvatarId)
    ) {
      await this.delete(oldAvatar.id, true);
    }
    // upload avatar mới
    if (files.avatar?.length) {
      const avatarFile = files.avatar[0];
      const relativePath = avatarFile.path.replace(/\\/g, '/');

      await this.repo.save(
        this.repo.create({
          url: `/${relativePath.split('uploads/')[1]}`,
          refId,
          refType,
          sortOrder: 0,
          isPrimary: true,
        }),
      );
    }
    const oldGallery = oldImages.filter((x) => !x.isPrimary);
    const deleteGallery = oldGallery.filter(
      (img) => !existingGalleryIds.includes(img.id),
    );
    await this.deleteMany(deleteGallery.map((img) => img.id), true);
    // for (const img of deleteGallery) {
    //   await this.delete(img.id, true);
    // }

    // thêm gallery mới
    if (files.gallery?.length) {
      const newGallery = files.gallery.map((file, index) => {
        const relativePath = file.path.replace(/\\/g, '/');

        return this.repo.create({
          url: `/${relativePath.split('uploads/')[1]}`,
          refId,
          refType,
          sortOrder: index + 1,
        });
      });

      await this.repo.save(newGallery);
    }

    return true;
  }

  async delete(id: number, removePhysical = true) {
    const image = await this.repo.findOneBy({ id });
    if (!image) {
      if (removePhysical) { return false; }
      throw new Error('Image not found');
    }
    const filePath = `./uploads/${image.url.replace('/uploads/', '')}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await this.repo.delete(id);
    if (removePhysical) { return true; }
    return { message: 'Deleted successfully' };
  }
  async deleteMany(ids: number[], removePhysical = true) {
     if (!ids?.length) {
    return true;
  }
    const images = await this.repo.findBy({ id: In(ids) });

    for (const img of images) {
      const filePath = `./uploads/${img.url.replace('/uploads/', '')}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.repo.delete(ids);
    if (removePhysical) { return true; }
    return { message: 'Deleted many successfully' };
  }
}

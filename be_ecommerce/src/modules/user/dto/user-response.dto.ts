import { Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD') : null))
  dateOfBirth: string;

  @Expose()
  createdAt: Date;
}

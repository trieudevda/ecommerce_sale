import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class AppService {
  getHello(id: string): string {
    const date = dayjs().format();
    return date;
  }
}

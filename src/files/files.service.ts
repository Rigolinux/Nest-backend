import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    //search for the image in the static folder
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path))
      throw new BadRequestException('The image does not exist');

    return path;
  }
}

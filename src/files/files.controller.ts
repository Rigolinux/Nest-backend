import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}
  @Get('product/:imageName')
  findOne(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  // Express.Multer.File is a type that represents a file uploaded via Multer
  // it's a type that's defined in the @types/multer package for TypeScript to use
  // npm install --save-dev @types/multer
  @Post('product')
  //this is a interceptor that will intercept the request and handle the file upload
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: {},
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    //check if the file is empty
    if (!file)
      throw new BadRequestException('The format of the file is invalid');

    const secureUrl = `${this.configService.get('host')}/files/product/${
      file.filename
    }`;

    return;
    secureUrl;
  }
}

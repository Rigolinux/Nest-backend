import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

//product entity
import { Product, ProductImage } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

//validate
import { validate as Isuuid } from 'uuid';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {
  //to show error more clearly use this
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        user,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return product.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (Isuuid(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(
          `title=:title or slug =:slug or title=LOWER(:title) or slug =LOWER(:slug)  `,
          { title: term, slug: term },
        )
        .leftJoinAndSelect('prod.images', 'images')
        .getOne();
    }
    if (!product) {
      throw new BadRequestException(`Product with term ${term} not found`);
    }
    return product;
  }

  async findOnePlain(id: string) {
    const { images = [], ...product } = await this.findOne(id);
    return {
      ...product,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...productDetails } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...productDetails,
    });
    if (!product)
      throw new BadRequestException(`Product with id ${id} not found`);

    //query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        //delete old images
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      //await this.productRepository.save(product);
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    this.productRepository.remove(product);
    return;
  }

  private handleExceptions(error) {
    if (error.code === '23505') {
      this.logger.error(error.detail);
      throw new BadGatewayException(error.detail);
    }
    //to shio error more clearly use this
    this.logger.error(error.message, error.stack);
    throw new InternalServerErrorException('Internal Server Error');
  }

  async deletaAll() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }
}

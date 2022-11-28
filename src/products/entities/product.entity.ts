import { ProductImage } from './produc-image.entity';
import { User } from '../../auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '07c88c45-510f-4135-98d0-b8a1f2a9aa3c',
    description: 'Product id',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Product 1',
    description: 'Product title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty()
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty()
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty()
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column({
    type: 'text',
    default: [],
    array: true,
  })
  tags: string[];

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @ApiProperty()
  images: ProductImage[];

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @BeforeUpdate()
  @BeforeInsert()
  checkSlug() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}

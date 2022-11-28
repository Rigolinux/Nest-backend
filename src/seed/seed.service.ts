import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { use } from 'passport';
@Injectable()
export class SeedService {
  constructor(
    //use products service from the other module
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runseed() {
    await this.drop();
    const user = await this.insertUsers();
    await this.insertProducts(user);
    return 'seed executed';
  }

  private async drop() {
    await this.productsService.deletaAll();

    //delete all users
    const querybuilder = this.userRepository.createQueryBuilder();
    await querybuilder.delete().from(User).execute();
  }
  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(async (user) => {
      user.password = await bcrypt.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });
    const dbUser = await this.userRepository.save(seedUsers);

    return dbUser[0];
  }
  private async insertProducts(user: User) {
    await this.productsService.deletaAll();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    try {
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}

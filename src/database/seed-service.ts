import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../accounts/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    await this.createUser();
  }

  async createUser() {
    try {
      const userRepository = this.dataSource.getRepository(User);

      const userExists = await userRepository.findOne({
        where: { username: 'user01' },
      });

      if (!userExists) {
        await userRepository.save({
          username: 'user01',
          password: '12345678',
        });
        console.log('User default created with success');
      } else {
        console.log('User default already exists');
      }
    } catch (error) {
      console.error('Error to create a default user', error);
    }
  }
}

import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }
  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        email: 'test@test.com',
        firstName: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }
}

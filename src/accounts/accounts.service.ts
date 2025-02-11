import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginAccountDto } from './dto/login-account.dto';
import * as dotenv from 'dotenv';
import { SessionTokenResponseDto } from './dto/session-token-response.dto';
import { logoutAccountDto } from './dto/logout-account.dto';
import { CheckTokens } from './auth/CheckTokens';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

dotenv.config();

@Injectable()
export class AccountsService {
  private readonly checkTokens = new CheckTokens();
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async Login({ password, username }: LoginAccountDto): Promise<SessionTokenResponseDto> {
    try {
      const user = await this.repository.findOne({ where: { username } });
      if (!user) throw new BadRequestException('Username or password incorrect');

      if (user.password !== password) throw new BadRequestException('Username or password incorrect');

      const sessionId = await this.createSession(user);
      return { sessionId };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Internal server error to login user');
    }
  }

  async Logout({ sessionId }: logoutAccountDto): Promise<void> {
    try {
      this.checkTokens.invalidateToken(sessionId);
    } catch {
      throw new InternalServerErrorException('Error to logout user');
    }
  }

  private async createSession(user: User): Promise<string> {
    try {
      const payload = {
        userId: user.id,
        username: user.username,
      };

      const token = this.jwtService.sign(payload);

      return token;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException('Error to create session');
    }
  }
}

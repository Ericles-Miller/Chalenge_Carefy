import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { HttpService } from '@nestjs/axios';
import { ResponseTokenDto } from './dto/response-token.dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AccountsService {
  constructor(private readonly httpService: HttpService) {}

  async Login(createAccountDto: CreateAccountDto) {
    const responseTokenDto = await this.getRequestToken();
    console.log(responseTokenDto);
  }

  Logout() {
    return `This action returns all accounts`;
  }

  private async getRequestToken(): Promise<ResponseTokenDto> {
    try {
      const response = await this.httpService.axiosRef.get(
        'https://api.themoviedb.org/3/authentication/token/new',
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN_API}`,
            accept: 'application/json',
          },
        },
      );

      return response.data;
    } catch {
      throw new InternalServerErrorException('Error to find request token');
    }
  }
}

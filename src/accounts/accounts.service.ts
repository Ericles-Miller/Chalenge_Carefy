import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { HttpService } from '@nestjs/axios';
import { ResponseTokenDto } from './dto/response-token.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly httpService: HttpService) {}

  Login(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account';
  }

  Logout() {
    return `This action returns all accounts`;
  }

  async getRequestToken(): Promise<ResponseTokenDto> {
    try {
      const response = await this.httpService.axiosRef.post(
        `${process.env.BASE_URL}/authentication/token/new?api_key=${process.env.API_KEY}`,
      );

      return response.data;
    } catch {
      throw new InternalServerErrorException('Error to find request token');
    }
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAccountDto } from './dto/login-account.dto';
import { HttpService } from '@nestjs/axios';
import { ResponseTokenDto } from './dto/response-token.dto';
import * as dotenv from 'dotenv';
import { SessionTokenResponseDto } from './dto/session-token-response.dto';
import { logoutAccountDto } from './dto/logout-account.dto';

dotenv.config();

@Injectable()
export class AccountsService {
  constructor(private readonly httpService: HttpService) {}

  async Login({ password, username }: LoginAccountDto): Promise<SessionTokenResponseDto> {
    try {
      const { requestToken } = await this.getRequestToken();

      await this.httpService.axiosRef.post(
        `https://api.themoviedb.org/3/authentication/token/validate_with_login`,
        {
          username,
          password,
          request_token: requestToken,
        },
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TOKEN_API}`,
          },
        },
      );

      const sessionId = await this.createSession(requestToken);
      return { sessionId };
    } catch (error) {
      this.handleHttpError(error, 'Error to login user');
    }
  }

  async Logout({ sessionId }: logoutAccountDto): Promise<void> {
    try {
      await this.httpService.axiosRef.delete('https://api.themoviedb.org/3/authentication/session', {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_API}`,
          accept: 'application/json',
        },
        data: { session_id: sessionId },
      });
    } catch (error) {
      this.handleHttpError(error, 'Error to logout user');
    }
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

      return {
        expiresAt: response.data.expires_at,
        requestToken: response.data.request_token,
        success: response.data.success,
      };
    } catch (error) {
      this.handleHttpError(error, 'Error to get request token');
    }
  }

  private async createSession(requestToken: string): Promise<string> {
    try {
      const response = await this.httpService.axiosRef.post(
        'https://api.themoviedb.org/3/authentication/session/new',
        { request_token: requestToken },
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN_API}`,
            accept: 'application/json',
          },
        },
      );

      return response.data.session_id;
    } catch (error) {
      this.handleHttpError(error, 'Error to create session');
    }
  }

  private handleHttpError(error: any, message: string): never {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        throw new UnauthorizedException(data?.status_message);
      }

      if (status === 400) {
        throw new BadRequestException(data?.status_message);
      }

      throw new InternalServerErrorException(`${message}: ${data?.status_message}`);
    }

    throw new InternalServerErrorException(`${message}: Unexpected server error`);
  }
}

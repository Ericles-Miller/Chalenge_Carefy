import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { HttpService } from '@nestjs/axios';
import { ResponseTokenDto } from './dto/response-token.dto';
import * as dotenv from 'dotenv';
import { SessionTokenResponseDto } from './dto/session-token-response.dto';

dotenv.config();

@Injectable()
export class AccountsService {
  constructor(private readonly httpService: HttpService) {}

  async Login({
    password,
    username,
  }: CreateAccountDto): Promise<SessionTokenResponseDto> {
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

    const token = await this.createSession(requestToken);
    return token;
  }

  async Logout(sessionId: string) {
    try {
      await this.httpService.axiosRef.delete(
        'https://api.themoviedb.org/3/authentication/session',
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN_API}`,
            accept: 'application/json',
          },
          data: { session_id: sessionId },
        },
      );

      return { message: 'Sessão encerrada com sucesso' };
    } catch {
      throw new InternalServerErrorException('Erro ao encerrar sessão');
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
    } catch {
      throw new InternalServerErrorException('Error to find request token');
    }
  }

  private async createSession(requestToken: string) {
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
      throw new InternalServerErrorException('Erro ao criar a sessão', error);
    }
  }
}

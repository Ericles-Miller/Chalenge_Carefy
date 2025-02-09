import { HttpService } from '@nestjs/axios';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class GetPayloadUserMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  async use(request: Request, response: Response, next: (error?: Error | any) => void) {
    const sessionId = request.headers.authorization;

    if (!sessionId) throw new UnauthorizedException();

    const dataUser = await this.httpService.axiosRef.get(`https://api.themoviedb.org/3/account`, {
      headers: {
        accept: 'application/json',
      },
      params: {
        api_key: process.env.API_KEY,
        session_id: sessionId,
      },
    });

    (request as any).user = {
      sessionId,
      accountId: dataUser.data.id,
    };
    next();
  }
}

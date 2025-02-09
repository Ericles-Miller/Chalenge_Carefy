import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['authorization'];

    if (!sessionId) {
      throw new UnauthorizedException('Session ID is required');
    }

    try {
      await this.httpService.axiosRef.get(`https://api.themoviedb.org/3/account`, {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_API}`,
        },
        params: { session_id: sessionId },
      });

      return true;
    } catch {
      throw new UnauthorizedException('Invalid session ID');
    }
  }
}

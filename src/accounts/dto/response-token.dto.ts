export class ResponseTokenDto {
  success: boolean;
  expires_at: Date;
  request_token: string;
}

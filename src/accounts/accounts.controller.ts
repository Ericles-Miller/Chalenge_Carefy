import { Controller, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiTags } from '@nestjs/swagger';
import { SessionTokenResponseDto } from './dto/session-token-response.dto';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async login(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<SessionTokenResponseDto> {
    const url = this.accountsService.Login(createAccountDto);
    return url;
  }
}

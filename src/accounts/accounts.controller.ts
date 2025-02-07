import { Controller, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.Login(createAccountDto);
  }
}

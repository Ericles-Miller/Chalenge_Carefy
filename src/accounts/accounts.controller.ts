import { Controller, Post, Body, UseGuards, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { LoginAccountDto } from './dto/login-account.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionTokenResponseDto } from './dto/session-token-response.dto';
import { AuthGuard } from './auth/AuthGuards';
import { logoutAccountDto } from './dto/logout-account.dto';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new session with username and password.',
    description: `
    sample request to create a new session in API
    POST /accounts
    body : {
      "username": "JohnDoe",
      "password": "**********",
    }
    `,
  })
  @ApiResponse({ status: 201, description: 'User logged in successfully', type: SessionTokenResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation errors or invalid data.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid credentials.' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Something went wrong on the server.',
  })
  async login(@Body() LoginAccountDto: LoginAccountDto): Promise<SessionTokenResponseDto> {
    return await this.accountsService.Login(LoginAccountDto);
  }

  @Delete()
  @ApiBearerAuth('sessionAuth')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Create a new session with username and password.',
    description: `
    sample request to finished session of user
    DELETE /accounts
    body : {
      "sessionId": "3423565645621egdfg765675" ,
    }
    `,
  })
  @ApiResponse({ status: 200, description: 'logout user successfully', type: 'string' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation errors or invalid data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Something went wrong on the server.',
  })
  async logout(@Body() logoutAccountDto: logoutAccountDto): Promise<{ message: string }> {
    await this.accountsService.Logout(logoutAccountDto);

    return { message: 'session ended successfully' };
  }
}

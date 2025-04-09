import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ILoginBody, RegisterBodyDto } from './dto';
import { Response, Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: ILoginBody, @Res() res: Response) {
    return this.authService.login(dto, res);
  }
  @Post('/register')
  register(@Body() dto: RegisterBodyDto) {
    console.log(dto);
    return this.authService.register(dto);
  }

  @Post('/refresh')
  refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    console.log(refreshToken);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.refreshToken(refreshToken, res);
  }
}

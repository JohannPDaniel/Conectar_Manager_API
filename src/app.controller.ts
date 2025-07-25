import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  test(@Req() req: Request) {
    console.log('ENTROU NO /test');
    return { message: 'ok', body: req.body };
  }
}

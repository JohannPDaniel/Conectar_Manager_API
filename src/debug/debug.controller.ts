// src/debug/debug.controller.ts
import { Controller, Post, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('debug')
export class DebugController {
  @Post()
  post(@Req() req: Request) {
    return { ok: true, body: req.body };
  }

  @Get()
  get() {
    return { msg: 'GET OK' };
  }
}

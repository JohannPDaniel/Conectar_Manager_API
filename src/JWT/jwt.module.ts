import { Module } from '@nestjs/common';
import { JWT } from '../utils';

@Module({
  providers: [JWT],
  exports: [JWT],
})
export class JwtModule {}

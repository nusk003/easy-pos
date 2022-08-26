import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Space } from '@src/modules/space/space.entity';
import { AuthModule } from '@src/modules/auth/auth.module';
import { SpaceResolver } from './space.resolver';
import { SpaceService } from './space.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Space] }), AuthModule],
  providers: [SpaceService, SpaceResolver],
  exports: [SpaceService],
})
export class SpaceModule {}

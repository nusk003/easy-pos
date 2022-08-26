import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth/auth.module';
import { Hotel } from '@src/modules/hotel/entities';
import { Group } from './entities';
import { GroupResolver } from './group.resolver';
import { GroupService } from './group.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Group, Hotel] }),
    forwardRef(() => AuthModule),
  ],
  providers: [GroupService, GroupResolver],
  exports: [GroupService],
})
export class GroupModule {}

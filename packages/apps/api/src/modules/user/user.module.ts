import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth/auth.module';
import { GroupModule } from '@src/modules/group/group.module';
import { HotelModule } from '@src/modules/hotel/hotel.module';
import { Role } from '@src/modules/role/role.entity';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User, Role] }),
    GroupModule,
    forwardRef(() => HotelModule),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}

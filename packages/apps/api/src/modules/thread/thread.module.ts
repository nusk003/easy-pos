import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth/auth.module';
import { MessageModule } from '@src/modules/message/message.module';
import { Thread } from '@src/modules/thread/thread.entity';
import { ThreadResolver } from './thread.resolver';
import { ThreadService } from './thread.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Thread] }),
    forwardRef(() => MessageModule),
    AuthModule,
  ],
  providers: [ThreadService, ThreadResolver],
  exports: [ThreadService],
})
export class ThreadModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth/auth.module';
import { Message } from '@src/modules/message/message.entity';
import { ThreadModule } from '@src/modules/thread/thread.module';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Message] }),
    AuthModule,
    ThreadModule,
  ],
  providers: [MessageService, MessageResolver],
  exports: [MessageService],
})
export class MessageModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@src/libs/elasticsearch';
import { AuthModule } from '@src/modules/auth/auth.module';
import { Customer } from './customer.entity';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [Customer] }),
    ElasticsearchModule,
    AuthModule,
  ],
  providers: [CustomerService, CustomerResolver],
  exports: [CustomerService],
})
export class CustomerModule {}

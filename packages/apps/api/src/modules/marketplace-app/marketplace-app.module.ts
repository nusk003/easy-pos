import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/auth/auth.module';
import { MarketplaceApp } from './marketplace-app.entity';
import { MarketplaceAppResolver } from './marketplace-app.resolver';
import { MarketplaceAppService } from './marketplace-app.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [MarketplaceApp] }),
    forwardRef(() => AuthModule),
  ],
  providers: [MarketplaceAppService, MarketplaceAppResolver],
  exports: [MarketplaceAppService],
})
export class MarketplaceAppModule {}

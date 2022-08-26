import { Module } from '@nestjs/common';
import { FileManagementService } from './file-management.service';

@Module({
  providers: [FileManagementService],
  exports: [FileManagementService],
})
export class FileManagementModule {}

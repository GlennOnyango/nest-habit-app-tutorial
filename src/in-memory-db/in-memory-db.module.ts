import { Module } from '@nestjs/common';
import { InMemoryDbService } from './in-memory-db.service';

@Module({
  exports: [InMemoryDbService],
  providers: [InMemoryDbService],
})
export class InMemoryDbModule {}

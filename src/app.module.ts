import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HabitsModule } from './habits/habits.module';
import { InMemoryDbModule } from './in-memory-db/in-memory-db.module';

@Module({
  imports: [HabitsModule, InMemoryDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

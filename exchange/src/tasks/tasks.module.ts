import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  providers: [TasksService, PrismaService],
  exports: [TasksService]
})
export class TasksModule {}

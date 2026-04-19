import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { ClientWorkOrdersController } from './client-work-orders.controller';
import { WorkOrdersController } from './work-orders.controller';
import { WorkOrdersService } from './work-orders.service';

@Module({
  imports: [PrismaModule],
  controllers: [WorkOrdersController, ClientWorkOrdersController],
  providers: [WorkOrdersService],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
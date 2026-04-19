import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkOrderStatus } from '../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { CreateWorkOrderPartItemDto } from './dto/create-work-order-part-item.dto';
import { CreateWorkOrderServiceItemDto } from './dto/create-work-order-service-item.dto';
import { UpdateWorkOrderPartItemDto } from './dto/update-work-order-part-item.dto';
import { UpdateWorkOrderServiceItemDto } from './dto/update-work-order-service-item.dto';
import { WorkOrdersService } from './work-orders.service';

@ApiTags('Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova ordem de serviço' })
  create(@Body() createWorkOrderDto: CreateWorkOrderDto) {
    return this.workOrdersService.create(createWorkOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as ordens de serviço' })
  findAll() {
    return this.workOrdersService.findAll();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Lista ordens de serviço por status' })
  findByStatus(@Param('status') status: WorkOrderStatus) {
    return this.workOrdersService.findByStatus(status);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Lista ordens de serviço por cliente' })
  findByCustomer(@Param('customerId') customerId: string) {
    return this.workOrdersService.findByCustomer(customerId);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Lista ordens de serviço por veículo' })
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.workOrdersService.findByVehicle(vehicleId);
  }

  @Post(':id/service-items')
  @ApiOperation({ summary: 'Adiciona item de serviço à OS' })
  addServiceItem(
    @Param('id') id: string,
    @Body() createDto: CreateWorkOrderServiceItemDto,
  ) {
    return this.workOrdersService.addServiceItem(id, createDto);
  }

  @Put(':id/service-items/:itemId')
  @ApiOperation({ summary: 'Atualiza item de serviço da OS' })
  updateServiceItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateWorkOrderServiceItemDto,
  ) {
    return this.workOrdersService.updateServiceItem(id, itemId, updateDto);
  }

  @Delete(':id/service-items/:itemId')
  @ApiOperation({ summary: 'Remove item de serviço da OS' })
  removeServiceItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.workOrdersService.removeServiceItem(id, itemId);
  }

  @Post(':id/part-items')
  @ApiOperation({ summary: 'Adiciona peça ou insumo à OS' })
  addPartItem(
    @Param('id') id: string,
    @Body() createDto: CreateWorkOrderPartItemDto,
  ) {
    return this.workOrdersService.addPartItem(id, createDto);
  }

  @Put(':id/part-items/:itemId')
  @ApiOperation({ summary: 'Atualiza peça ou insumo da OS' })
  updatePartItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateWorkOrderPartItemDto,
  ) {
    return this.workOrdersService.updatePartItem(id, itemId, updateDto);
  }

  @Delete(':id/part-items/:itemId')
  @ApiOperation({ summary: 'Remove peça ou insumo da OS' })
  removePartItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.workOrdersService.removePartItem(id, itemId);
  }

  @Post(':id/diagnosis/start')
  @ApiOperation({ summary: 'Inicia o diagnóstico da OS' })
  startDiagnosis(@Param('id') id: string) {
    return this.workOrdersService.startDiagnosis(id);
  }

  @Post(':id/awaiting-approval')
  @ApiOperation({ summary: 'Move a OS para aguardando aprovação' })
  moveToAwaitingApproval(@Param('id') id: string) {
    return this.workOrdersService.moveToAwaitingApproval(id);
  }

  @Post(':id/execution/start')
  @ApiOperation({ summary: 'Inicia a execução da OS' })
  startExecution(@Param('id') id: string) {
    return this.workOrdersService.startExecution(id);
  }

  @Post(':id/finish')
  @ApiOperation({ summary: 'Finaliza a OS' })
  finish(@Param('id') id: string) {
    return this.workOrdersService.finish(id);
  }

  @Post(':id/deliver')
  @ApiOperation({ summary: 'Registra a entrega da OS' })
  deliver(@Param('id') id: string) {
    return this.workOrdersService.deliver(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma OS por ID' })
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }
}
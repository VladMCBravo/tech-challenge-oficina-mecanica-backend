// src/work-orders/application/use-cases/approve-budget-webhook.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import type { IWorkOrderRepository } from '../../domain/repositories/work-order.repository.interface';
import { ApproveBudgetWebhookDto } from '../../dto/approve-budget-webhook.dto';

@Injectable()
export class ApproveBudgetWebhookUseCase {
  constructor(private readonly workOrderRepository: IWorkOrderRepository) {}

  async execute(dto: ApproveBudgetWebhookDto) {
    // 1. Verifica se a Ordem de Serviço existe
    const workOrder = await this.workOrderRepository.findById(dto.workOrderId);
    
    if (!workOrder) {
      throw new NotFoundException('Ordem de serviço não encontrada.');
    }

    // 2. Define o novo status baseado na resposta do webhook
    // Assumindo que os seus status no Prisma sejam 'IN_EXECUTION' e 'CANCELED'
    const newStatus = dto.approved ? 'IN_EXECUTION' : 'CANCELED';

    // 3. Atualiza na base de dados
    const updatedWorkOrder = await this.workOrderRepository.updateStatus(dto.workOrderId, newStatus);

    // 💡 NOTA PARA O FUTURO: 
    // É exatamente AQUI que nós vamos colocar o disparo de E-mail no próximo passo!

    return {
      message: dto.approved ? 'Orçamento aprovado com sucesso.' : 'Orçamento rejeitado.',
      workOrder: updatedWorkOrder,
    };
  }
}
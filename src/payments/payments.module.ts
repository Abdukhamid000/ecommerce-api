import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';
import { StripeModule } from './stripe.module.js';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [StripeModule],
  exports: [PaymentsService],
})
export class PaymentsModule {}

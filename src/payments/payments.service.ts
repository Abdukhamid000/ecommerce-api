import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './stripe.module.js';
import { PaymentIntentCreateParams } from './types/payment-intent-create-params.js';

@Injectable()
export class PaymentsService {
  private logger = new Logger(PaymentsService.name);
  constructor(@Inject(STRIPE_CLIENT) private stripe: Stripe) {}

  async createIntent({ amountCents, orderId }: PaymentIntentCreateParams) {
    try {
      const { client_secret, id } = await this.stripe.paymentIntents.create(
        {
          amount: amountCents,
          currency: 'usd',
          confirm: true,
          payment_method: 'pm_card_visa',
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          metadata: { order_id: String(orderId) },
        },
        { idempotencyKey: `order-${orderId}` },
      );

      return { client_secret, id };
    } catch (e) {
      this.logger.debug(e);
      throw new ServiceUnavailableException('Payment provider unavailable');
    }
  }
}

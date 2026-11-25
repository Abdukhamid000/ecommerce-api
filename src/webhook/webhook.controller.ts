import {
  BadRequestException,
  Controller,
  Headers,
  Inject,
  Post,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import Stripe from 'stripe';
import { Public } from '../common/decorators.js';
import { STRIPE_CLIENT } from '../payments/stripe.module.js';

@Public()
@Controller('webhook')
export class WebhookController {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private configService: ConfigService,
  ) {}

  @Post()
  handleIncoming(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    console.log(signature, 'signature');
    if (!req.rawBody) throw new BadRequestException('Raw body not available');
    try {
      this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.configService.getOrThrow('STRIPE_WEBHOOK_SECRET'),
      );
      console.log(req.rawBody, 'rawBODY', signature);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Webhook Error');
    }
  }
}

import { Module } from '@nestjs/common';
import { MessagesWsService } from './message-ws.service';
import { MessagesWsGateway } from './message-ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [AuthModule],
})
export class MessageWsModule {}

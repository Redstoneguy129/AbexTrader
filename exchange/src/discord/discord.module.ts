import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { PrismaService } from '../prisma.service';
import { DiscordCommands } from './discord.commands';

@Module({
  imports: [
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      development: ["1238687667953209394"],
      intents: [],
    })
  ],
  providers: [DiscordCommands, PrismaService]
})
export class DiscordModule {}

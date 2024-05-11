import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DiscordCommands {
  constructor(private readonly prismaService: PrismaService) {}

  @SlashCommand({ name: "signin", description: "Signin to your trading account" })
  public async onSignIn(@Context() [interaction]: SlashCommandContext) {
    const trader = await this.prismaService.trader.upsert({
      where: {
        id: interaction.user.id
      },
      create: {
        id: interaction.user.id,
        name: interaction.user.username,
        balance: 0,
      },
      update: {}
    });
    return interaction.reply({
      content: "Please use this token to sign in to the trading client.\nToken: "+trader.oneTimeToken+".\nDo not share this token with anyone else.",
      ephemeral: true
    });
  }
}
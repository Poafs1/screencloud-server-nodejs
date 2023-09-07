import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthDto, AuthInputDto } from './dto/auth.dto';
import axios from 'axios';
import { ConfigsService } from '../configs/configs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceEntity } from './entities/balance.entity';
import { Repository } from 'typeorm';
import { MachineBalanceEntity } from './entities/machine-balance.entity';
import { WithdrawDto, WithdrawInputDto } from './dto/withdraw.dto';
import { INotes } from './interfaces/note.interface';

@Injectable()
export class CoreService {
  private readonly screenCloudApiEndpoint: string;
  private readonly allowedOverdraft: number;

  constructor(
    private configsService: ConfigsService,
    @InjectRepository(BalanceEntity)
    private balanceEntity: Repository<BalanceEntity>,
    @InjectRepository(MachineBalanceEntity)
    private machineBalanceEntity: Repository<MachineBalanceEntity>,
  ) {
    this.screenCloudApiEndpoint = this.configsService.screenCloudApiEndpoint;
    this.allowedOverdraft = 100;
  }

  private async authorizePin(pin: string): Promise<BalanceEntity> {
    return this.balanceEntity
      .findOne({
        where: {
          pin,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }

  private async findMachineBalance(orderBy?: {
    [key in keyof MachineBalanceEntity]?: 'ASC' | 'DESC';
  }): Promise<MachineBalanceEntity[]> {
    return this.machineBalanceEntity
      .find({
        order: orderBy,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }

  async auth(authInputDto: AuthInputDto): Promise<AuthDto> {
    const { pin } = authInputDto;

    // Authorize PIN
    const foundCurrentBalance = await axios
      .post(this.screenCloudApiEndpoint, {
        pin,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    if (foundCurrentBalance.status !== 200) {
      throw new ForbiddenException('Invalid PIN');
    }

    const { currentBalance } = foundCurrentBalance.data;

    // Reset balance for testing purpose
    await this.resetData(pin, currentBalance);

    return {
      currentBalance,
    };
  }

  async withdraw(withdrawInputDto: WithdrawInputDto): Promise<WithdrawDto> {
    const { amount, pin } = withdrawInputDto;

    if (!amount) {
      throw new ForbiddenException('Amount must be greater than 0');
    }

    const [foundBalance, foundMachineBalance] = await Promise.all([
      this.authorizePin(pin),
      this.findMachineBalance({
        note: 'DESC',
      }),
    ]);

    // Authorize PIN
    if (!foundBalance) {
      throw new ForbiddenException('Invalid PIN');
    }

    const { balance } = foundBalance;

    // System allows overdraft up to 100
    if (balance + this.allowedOverdraft < amount) {
      throw new ForbiddenException('Balance is overdrawn');
    }

    // Check if machine balance is sufficient
    if (!foundMachineBalance) {
      throw new ForbiddenException('Machine balance is empty');
    }

    // Notes calculation
    let withdrawAmount = amount;

    const notesCount: INotes = {
      '5': 0,
      '10': 0,
      '20': 0,
    };

    const machineBalanceUpdates = [];

    for (const note of foundMachineBalance) {
      if (note.amount === 0) {
        continue;
      }

      let totalNoteAmount = Math.floor(withdrawAmount / note.note);

      // If note amount is less than total note amount, use note amount instead
      if (note.amount < totalNoteAmount) {
        totalNoteAmount = note.amount;
      }

      const totalNoteBalanceAmount = totalNoteAmount * note.note;

      if (totalNoteBalanceAmount <= withdrawAmount) {
        withdrawAmount -= totalNoteBalanceAmount;
        notesCount[note.note] = totalNoteAmount;

        machineBalanceUpdates.push({
          ...note,
          amount: note.amount - totalNoteAmount,
        });
      }

      if (withdrawAmount === 0) {
        break;
      }
    }

    await this.machineBalanceEntity.save(machineBalanceUpdates).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    if (withdrawAmount !== 0) {
      throw new ForbiddenException('Insufficient machine balance');
    }

    // Update user balance
    const currentBalance = balance - amount;

    await this.balanceEntity
      .save({
        ...foundBalance,
        balance: currentBalance,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    const isOverdraft = currentBalance < 0;

    return {
      notes: notesCount,
      isOverdraft,
      currentBalance,
    };
  }

  // For testing purpose
  async resetData(pin: string, currentBalance: number): Promise<boolean> {
    // Reset user balance
    const foundBalance = await this.authorizePin(pin);

    // We initialize new balance everytime, since it's for testing purpose.
    if (!foundBalance) {
      await this.balanceEntity
        .save(this.balanceEntity.create({ pin, balance: currentBalance }))
        .catch((error) => {
          throw new InternalServerErrorException(error);
        });
    } else {
      await this.balanceEntity
        .save({
          ...foundBalance,
          balance: currentBalance,
        })
        .catch((error) => {
          throw new InternalServerErrorException(error);
        });
    }

    // Reset machine balance
    await this.machineBalanceEntity.delete({}).catch((error) => {
      throw new InternalServerErrorException(error);
    });

    await this.machineBalanceEntity
      .save(
        this.machineBalanceEntity.create([
          {
            note: 5,
            amount: 10,
          },
          {
            note: 10,
            amount: 15,
          },
          {
            note: 20,
            amount: 7,
          },
        ]),
      )
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    return true;
  }
}

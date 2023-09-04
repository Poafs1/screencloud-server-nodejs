import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthDto, AuthInputDto } from './dto/auth.dto';
import axios from 'axios';
import { ConfigsService } from '../configs/configs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceEntity } from './entities/balance.entity';
import { Repository } from 'typeorm';
import { MachineBalanceEntity } from './entities/machine-balance.entity';
import { WithdrawInputDto } from './dto/withdraw.dto';

@Injectable()
export class CoreService {
  constructor(
    private configsService: ConfigsService,
    @InjectRepository(BalanceEntity)
    private balanceEntity: Repository<BalanceEntity>,
    @InjectRepository(MachineBalanceEntity)
    private machineBalanceEntity: Repository<MachineBalanceEntity>,
  ) {}

  async auth(authInputDto: AuthInputDto): Promise<AuthDto> {
    const { pin } = authInputDto;
    const { screenCloudApiEndpoint } = this.configsService;

    const foundCurrentBalance = await axios
      .post(screenCloudApiEndpoint, {
        pin,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

    if (foundCurrentBalance.status !== 200) {
      throw new Error('Invalid PIN');
    }

    const { currentBalance } = foundCurrentBalance.data;

    const foundBalance = await this.balanceEntity
      .findOne({
        where: {
          pin,
        },
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });

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

    return {
      currentBalance,
    };
  }

  async resetData(): Promise<boolean> {
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

  async withdraw(withdrawInputDto: WithdrawInputDto): Promise<void> {
    const { amount } = withdrawInputDto;

    console.log('amount', amount);

    return null;
  }
}

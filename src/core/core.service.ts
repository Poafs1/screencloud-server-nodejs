import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthDto, AuthInputDto } from './dto/auth.dto';
import axios from 'axios';
import { ConfigsService } from '../configs/configs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceEntity } from './entities/balance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoreService {
  constructor(
    private configsService: ConfigsService,
    @InjectRepository(BalanceEntity)
    private balanceEntity: Repository<BalanceEntity>,
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
}

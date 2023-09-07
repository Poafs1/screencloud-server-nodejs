import { getRepositoryToken } from '@nestjs/typeorm';
import { MachineBalanceEntity } from '../../../../core/entities/machine-balance.entity';
import { BalanceEntity } from '../../../../core/entities/balance.entity';
import { mockBalance, mockMachineBalance } from '../../mock/dataDB';
import { sortBy } from '../../utils/arrays.util';

export const balanceEntityProvider = {
  provide: getRepositoryToken(BalanceEntity),
  useFactory: jest.fn(() => ({
    findOne: jest.fn((data) => {
      const { pin } = data.where;

      if (!pin) {
        return Promise.reject(new Error('Invalid PIN'));
      }

      const row = mockBalance.find((item) => item.pin === pin);

      if (!row) {
        return Promise.reject(new Error('Invalid PIN'));
      }

      return Promise.resolve(row);
    }),
    save: jest.fn((data) => {
      const { pin, balance } = data;

      const row = mockBalance.find((item) => item.pin === pin);

      row.balance = balance;

      return Promise.resolve(true);
    }),
  })),
};

export const machineBalanceEntityProvider = {
  provide: getRepositoryToken(MachineBalanceEntity),
  useFactory: jest.fn(() => ({
    find: jest.fn((data) => {
      const { order } = data;

      if (order) {
        const { note } = order;

        if (note === 'DESC') {
          return Promise.resolve(sortBy(mockMachineBalance, 'note').reverse());
        }

        return Promise.resolve(sortBy(mockMachineBalance, 'note'));
      }

      return Promise.resolve(mockMachineBalance);
    }),
    save: jest.fn((data) => {
      for (const d of data) {
        const row = mockMachineBalance.find((item) => item.note === d.note);

        row.amount = d.amount;
      }

      return Promise.resolve(true);
    }),
  })),
};

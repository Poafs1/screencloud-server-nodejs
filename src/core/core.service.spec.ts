import { Test, TestingModule } from '@nestjs/testing';
import { CoreService } from './core.service';
import { ConfigsService } from '../configs/configs.service';
import { mockMethodResetData, mockMethodScreenCloudApiEndpoint } from './test/mock/function';
import { configsServiceProvider } from './test/providers/configs';
import { balanceEntityProvider, machineBalanceEntityProvider } from './test/providers/entities';

describe('CoreService', () => {
  let service: CoreService;
  let configs: ConfigsService;

  const validPin = '1111';

  let mockResetData;
  let mockScreenCloudApiEndpoint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreService,
        configsServiceProvider,
        balanceEntityProvider,
        machineBalanceEntityProvider,
      ],
    }).compile();

    service = module.get<CoreService>(CoreService);
    configs = module.get<ConfigsService>(ConfigsService);

    // Mock resetData method
    mockResetData = mockMethodResetData(service);
    // Mock ScreenCloud API endpoint
    mockScreenCloudApiEndpoint = mockMethodScreenCloudApiEndpoint(validPin);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('auth method', () => {
    it('should be defined', () => {
      expect(service.auth).toBeDefined();
    });

    it('should return an object of current balance if the PIN is valid', async () => {
      const mockResponse = {
        currentBalance: 220,
      };

      const data = {
        pin: validPin,
      };

      const result = await service.auth(data);

      // Check a mock method has been called
      expect(mockScreenCloudApiEndpoint).toHaveBeenCalledWith(configs.screenCloudApiEndpoint, data);
      expect(mockResetData).toHaveBeenCalledWith(validPin, mockResponse.currentBalance);

      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the PIN is invalid', async () => {
      const data1 = { pin: undefined };

      await service.auth(data1).catch((error) => {
        expect(error.message).toEqual('Invalid PIN');
        expect(error.status).toEqual(500);
      });

      const data2 = {
        pin: '1112',
      };

      const result = await service.auth(data2).catch((error) => {
        expect(error.message).toEqual('Invalid PIN');
        expect(error.status).toEqual(500);
      });

      // Check a mock method has been called
      expect(mockScreenCloudApiEndpoint).toHaveBeenCalledWith(
        configs.screenCloudApiEndpoint,
        data2,
      );
      expect(mockResetData).not.toHaveBeenCalled();

      expect(result).toBeUndefined();
    });
  });

  describe('withdraw method', () => {
    it('should be defined', () => {
      expect(service.withdraw).toBeDefined();
    });

    it('should return an object of current balance if the PIN is valid', async () => {
      // First withdraw
      const data1 = { pin: validPin, amount: 140 };

      const result = await service.withdraw(data1);

      expect(result).toEqual({
        notes: {
          '5': 0,
          '10': 0,
          '20': 7,
        },
        isOverdraft: false,
        currentBalance: 80,
      });

      // Second withdraw
      const data2 = { pin: validPin, amount: 50 };

      const result2 = await service.withdraw(data2);

      expect(result2).toEqual({
        notes: {
          '5': 0,
          '10': 5,
          '20': 0,
        },
        isOverdraft: false,
        currentBalance: 30,
      });

      // Third withdraw
      const data3 = { pin: validPin, amount: 90 };

      const result3 = await service.withdraw(data3);

      expect(result3).toEqual({
        notes: {
          '5': 0,
          '10': 9,
          '20': 0,
        },
        isOverdraft: true,
        currentBalance: -60,
      });
    });

    it('should throw an error if the input data is invalid', async () => {
      const data = { pin: undefined, amount: 140 };

      await service.withdraw(data).catch((error) => {
        expect(error.message).toEqual('Invalid PIN');
        expect(error.status).toEqual(500);
      });

      const data2 = { pin: '1111', amount: undefined };

      await service.withdraw(data2).catch((error) => {
        expect(error.message).toEqual('Amount must be greater than 0');
        expect(error.status).toEqual(403);
      });
    });

    it('should not allow overdraft more than 100', async () => {
      const data = { pin: validPin, amount: 330 };

      const result = await service.withdraw(data).catch((error) => {
        expect(error.message).toEqual('Balance is overdrawn');
        expect(error.status).toEqual(403);
      });

      expect(result).toBeUndefined();
    });
  });
});

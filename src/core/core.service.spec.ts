import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoreService } from './core.service';
import { BalanceEntity } from './entities/balance.entity';
import { MachineBalanceEntity } from './entities/machine-balance.entity';
import { ConfigsService } from '../configs/configs.service';
import axios from 'axios';

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
        {
          provide: ConfigsService,
          useValue: {
            screenCloudApiEndpoint: 'http://localhost:3000',
          },
        },
        {
          provide: getRepositoryToken(BalanceEntity),
          useFactory: jest.fn(),
        },
        {
          provide: getRepositoryToken(MachineBalanceEntity),
          useFactory: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<CoreService>(CoreService);
    configs = module.get<ConfigsService>(ConfigsService);

    // Mock resetData method
    mockResetData = jest
      .spyOn(service, 'resetData')
      .mockImplementation(() => Promise.resolve(true));

    // Mock ScreenCloud API endpoint
    mockScreenCloudApiEndpoint = jest
      .spyOn(axios, 'post')
      .mockImplementation((_url, data: { pin: string }) => {
        const { pin } = data;

        if (pin !== validPin) {
          return Promise.reject(new Error('Invalid PIN'));
        }

        return Promise.resolve({
          data: {
            currentBalance: 220,
          },
          status: 200,
        });
      });
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
      const data = {
        pin: '1112',
      };

      const result = await service.auth(data).catch((error) => {
        expect(error.message).toEqual('Invalid PIN');
        expect(error.status).toEqual(500);
      });

      // Check a mock method has been called
      expect(mockScreenCloudApiEndpoint).toHaveBeenCalledWith(configs.screenCloudApiEndpoint, data);
      expect(mockResetData).not.toHaveBeenCalled();

      expect(result).toBeUndefined();
    });
  });

  describe('withdraw method', () => {
    it('should be defined', () => {
      expect(service.withdraw).toBeDefined();
    });
  });
});

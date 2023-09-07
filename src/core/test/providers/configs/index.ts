import { ConfigsService } from '../../../../configs/configs.service';

export const configsServiceProvider = {
  provide: ConfigsService,
  useValue: {
    screenCloudApiEndpoint: 'http://localhost:3000',
  },
};

import axios from 'axios';

export const mockMethodResetData = (service) =>
  jest.spyOn(service, 'resetData').mockImplementation(() => Promise.resolve(true));

export const mockMethodScreenCloudApiEndpoint = (validPin) =>
  jest.spyOn(axios, 'post').mockImplementation((_url, data: { pin: string }) => {
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

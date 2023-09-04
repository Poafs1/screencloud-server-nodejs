interface IConstants {
  globalPrefix: string;
  enableCors: boolean;
}

export const CONSTANTS: IConstants = {
  globalPrefix: '/api',
  enableCors: process.env.NODE_ENV === 'production',
};

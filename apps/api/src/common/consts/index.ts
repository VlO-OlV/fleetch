export enum RedisKey {
  USER = 'user',
}

export enum RedisExpiryPeriod {
  LONG = 'LONG',
  MEDIUM = 'MEDIUM',
  SHORT = 'SHORT',
}

export const RedisExpiryPeriodToSecondsMap: Record<RedisExpiryPeriod, number> =
  {
    [RedisExpiryPeriod.LONG]: 60 * 24 * 3600,
    [RedisExpiryPeriod.MEDIUM]: 7 * 24 * 3600,
    [RedisExpiryPeriod.SHORT]: 24 * 3600,
  };

export enum BullMQKey {
  EMAIL = 'email',
}

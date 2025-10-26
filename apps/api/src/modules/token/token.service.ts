import { Injectable } from '@nestjs/common';
import { TokenRepository } from 'src/database/repositories/token.repository';

@Injectable()
export class TokenService {
  public constructor(private tokenRepository: TokenRepository) {}
}

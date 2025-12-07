import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UserService,
    configService: ConfigService,
  ) {
    const clientID = configService.get<string>('google.clientID') as string;
    const clientSecret = configService.get<string>(
      'google.clientSecret',
    ) as string;
    const callbackURL = configService.get<string>(
      'google.callbackURL',
    ) as string;

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    callback: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const email = emails?.[0].value;

    if (!email) {
      throw new BadRequestException('No email provided');
    }

    const existingUser = await this.userService.findByEmail(email);

    const user = {
      id: existingUser?.id || null,
      email: emails?.[0].value,
      firstName: name?.givenName,
      middleName: name?.middleName,
      lastName: name?.familyName,
      profilePicture: photos?.[0].value,
    };

    callback(null, user);
  }
}

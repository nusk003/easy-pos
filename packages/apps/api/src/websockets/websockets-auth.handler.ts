import { AuthService } from './services/auth.service';
import { WSEvent } from '@hm/sdk';

class Handler {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async auth(event: WSEvent) {
    await this.authService.decryptSession(event);

    const authPolicy = this.authService.generateAuthPolicy(event.methodArn);

    return authPolicy;
  }
}

const h = new Handler();
export const handler = new Handler().auth.bind(h);

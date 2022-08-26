import { __dev__, __domain__, __sg_mail_key__ } from '@constants';
import sgMail from '@sendgrid/mail';
import { UserEmailNotification } from '@src/microservices/send-email-notifications/services/send-hotel-email-notifications.service';
import { log } from '@src/utils/log/log';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { blacklist } from './blacklist';
import cloudConsoleLoginHbsJson from './templates/cloud-console-login.hbs.json';
import cloudConsoleUserInviteHbsJson from './templates/cloud-console-user-invite.hbs.json';
import guestAppLoginHbsJson from './templates/guest-app-login.hbs.json';
import guestCheckInCreatedHbsJson from './templates/guest-check-in-created.hbs.json';
import guestCheckInSubmittedHbsJson from './templates/guest-check-in-submitted.hbs.json';
import guestCheckInReviewedHbsJson from './templates/guest-check-in-reviewed.hbs.json';
import hotelNotificationsHbsJson from './templates/hotel-notifications.hbs.json';
import newMessageHbsJson from './templates/new-message.hbs.json';
import orderStatusHbsJson from './templates/order-status.hbs.json';

interface EmailRequestOptions<Data> {
  to: string | string[];
  subject: string;
  data: Data;
}

interface EmailSendOptions {
  to: string | string[];
  from?: string;
  subject: string;
  templateId: string;
  data: Record<string, any>;
}

export class Email {
  constructor(private readonly mail: typeof sgMail) {
    this.mail.setApiKey(__sg_mail_key__);
  }

  private compileTemplate(templateId: string, data: Record<string, any>) {
    const hbsTemplate = fs.readFileSync(
      path.resolve(`./src/utils/email/templates/${templateId}.hbs`),
      'utf8'
    );

    const html = handlebars.compile(hbsTemplate)(data);

    return html;
  }

  private async send(opts: EmailSendOptions) {
    const isBlacklisted = blacklist.some((condition) => {
      if (Array.isArray(opts.to)) {
        return opts.to.some((email) => {
          return email.match(condition);
        });
      } else {
        return opts.to.match(condition);
      }
    });

    if (isBlacklisted) {
      return;
    }

    const personalizations = [];

    if (Array.isArray(opts.to)) {
      opts.to.forEach((email) => {
        personalizations.push({ to: [{ email }] });
      });
    } else {
      personalizations.push({ to: [{ email: opts.to }] });
    }

    const message = {
      personalizations,
      from:
        opts.from ||
        `${opts.data.hotelName || 'Hotel Manager'} <hello@${__domain__}>`,
      subject: opts.subject,
      html: this.compileTemplate(opts.templateId, opts.data),
    };

    if (__dev__) {
      console.log();
      log.info('email', opts.templateId);
      console.log({
        personalizations: message.personalizations,
        from: message.from,
        subject: message.subject,
        data: opts.data,
      });
      return;
    }

    return this.mail.send(message);
  }

  async sendUserInvite(
    opts: EmailRequestOptions<typeof cloudConsoleUserInviteHbsJson>
  ) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'cloud-console-user-invite',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendUserLogin(
    opts: EmailRequestOptions<typeof cloudConsoleLoginHbsJson>
  ) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'cloud-console-login',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendGuestLogin(opts: EmailRequestOptions<typeof guestAppLoginHbsJson>) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'guest-app-login',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendGuestCheckInCreated(
    opts: EmailRequestOptions<typeof guestCheckInCreatedHbsJson>
  ) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'guest-check-in-created',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendGuestCheckInSubmitted(
    opts: EmailRequestOptions<typeof guestCheckInSubmittedHbsJson>
  ) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'guest-check-in-submitted',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendGuestCheckInReviewed(
    opts: EmailRequestOptions<typeof guestCheckInReviewedHbsJson>
  ) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'guest-check-in-reviewed',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendNewMessage(opts: EmailRequestOptions<typeof newMessageHbsJson>) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'new-message',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendOrderStatus(
    opts: EmailRequestOptions<
      Omit<typeof orderStatusHbsJson, 'discount'> & {
        discount?: { name: string; value: string };
      }
    >
  ) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'order-status',
      data: opts.data,
    };

    return this.send(msg);
  }

  async sendHotelNotifications(
    opts: EmailRequestOptions<
      Omit<typeof hotelNotificationsHbsJson, 'notifications'> & {
        notifications: UserEmailNotification[];
      }
    >
  ) {
    const msg = {
      to: opts.to,
      subject: opts.subject,
      templateId: 'hotel-notifications',
      data: opts.data,
    };

    return this.send(msg);
  }
}

const email = new Email(sgMail);

export { email };

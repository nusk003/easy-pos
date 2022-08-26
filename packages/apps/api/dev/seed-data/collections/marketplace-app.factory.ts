import { IntegrationType } from '@src/modules/hotel/entities';
import { MarketplaceApp } from '@src/modules/marketplace-app/marketplace-app.entity';
import { ObjectId } from 'mongodb';
import { developerUser } from './users.factory';

export const marketplaceApp = new MarketplaceApp();
marketplaceApp._id = new ObjectId('628ba934e8bf3ea3accecaa5');
marketplaceApp.developer = developerUser;
marketplaceApp.type = IntegrationType.PMS;
marketplaceApp.name = 'Aria';
marketplaceApp.description =
  'Aria is designed to simplify and automate all operations for modern hoteliers and their guests. From the booking engine to check-out, from front desk to revenue management, every process is easier, faster and more connected. And with the integrated Aria Payments ecosystem, every transaction is secure and seamless.';
marketplaceApp.logo = 'https://cdn.worldvectorlogo.com/logos/aria-3.svg';
marketplaceApp.redirectURLs = ['http://localhost:5000'];
marketplaceApp.connectLink = `http://localhost:3000/connect?marketplace_id=${marketplaceApp._id}&redirect_url=${marketplaceApp.redirectURLs[0]}`;
marketplaceApp.documentationURL = 'https://aria.com/docs';
marketplaceApp.helpURL = 'https://aria.com/help';
marketplaceApp.websiteURL = 'https://aria.com';
marketplaceApp.live = true;
marketplaceApp.enabled = true;

export const marketplaceApps = [marketplaceApp];

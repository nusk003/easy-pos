import { faker } from '@dev/seed-data/util';
import { Role, UserRole } from '@src/modules/role/role.entity';
import { User } from '@src/modules/user/user.entity';
import { sha256 } from 'js-sha256';
import { ObjectId } from 'mongodb';
import { hmGroup, mainGroup } from './groups.factory';
import { mainHotel } from './hotels.factory';

export const epUser = new User();
epUser._id = new ObjectId('5e4450175cc82b51f930291a');
epUser.firstName = 'Julia';
epUser.lastName = 'Anderson';
epUser.email = 'demo@easypos.co';
epUser.mobile = '07123456789';
epUser.jobTitle = 'General Manager';
epUser.password = sha256('123456789');
epUser.hotels.add(mainHotel);
epUser.group = hmGroup;

export const groupAdminUser = new User();
groupAdminUser._id = new ObjectId('5f7c70a9269a9e25ffa7db68');
groupAdminUser.firstName = faker.name.firstName();
groupAdminUser.lastName = faker.name.lastName();
groupAdminUser.email = 'ga@hotelmanager.co';
groupAdminUser.mobile = '07123456789';
groupAdminUser.jobTitle = 'Group Owner';
groupAdminUser.groupAdmin = true;
groupAdminUser.password = sha256('123456789');
groupAdminUser.hotels.add(mainHotel);
groupAdminUser.group = mainGroup;

export const developerUser = new User();
developerUser._id = new ObjectId('628ba5670ee1f05d6baa6757');
developerUser.firstName = faker.name.firstName();
developerUser.lastName = faker.name.lastName();
developerUser.email = 'dev@hotelmanager.co';
developerUser.mobile = '07123456789';
developerUser.jobTitle = 'Tech Lead';
developerUser.groupAdmin = true;
developerUser.password = sha256('123456789');
developerUser.developer = true;
developerUser.hotels.add(mainHotel);
developerUser.group = mainGroup;

export const hotelAdminUser = new User();
hotelAdminUser._id = new ObjectId('5f7c70b067a9655a0de62323');
hotelAdminUser.firstName = faker.name.firstName();
hotelAdminUser.lastName = faker.name.lastName();
hotelAdminUser.email = 'ha@hotelmanager.co';
hotelAdminUser.mobile = '07123456789';
hotelAdminUser.jobTitle = 'Hotel Owner';
hotelAdminUser.password = sha256('123456789');
hotelAdminUser.hotels.add(mainHotel);
hotelAdminUser.group = mainGroup;

export const hotelAdminUserRole = new Role();
hotelAdminUserRole.hotel = mainHotel;
hotelAdminUserRole.user = hotelAdminUser;
hotelAdminUserRole.role = UserRole.HotelAdmin;

export const hotelMemberUser = new User();
hotelMemberUser._id = new ObjectId('5f7c70b5fe6859911a8c0fc9');
hotelMemberUser.firstName = faker.name.firstName();
hotelMemberUser.lastName = faker.name.lastName();
hotelMemberUser.email = 'hm@hotelmanager.co';
hotelMemberUser.mobile = '07123456789';
hotelMemberUser.jobTitle = 'Restaurant Manager';
hotelMemberUser.password = sha256('123456789');
hotelMemberUser.hotels.add(mainHotel);
hotelMemberUser.group = mainGroup;

export const hotelMemberUserRole = new Role();
hotelMemberUserRole.hotel = mainHotel;
hotelMemberUserRole.user = hotelMemberUser;
hotelMemberUserRole.role = UserRole.HotelMember;

export const users = [epUser, groupAdminUser, hotelAdminUser, hotelMemberUser];
export const roles = [hotelAdminUserRole, hotelMemberUserRole];

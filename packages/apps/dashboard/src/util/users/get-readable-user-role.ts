import { User, UserRole } from '@hm/sdk';
import { getUserRole } from './get-user-role';

export enum ReadableRole {
  SuperAdmin = 'Hotel Manager',
  GroupAdmin = 'Group Admin',
  HotelAdmin = 'Hotel Admin',
  HotelMember = 'Hotel Member',
}

export const getReadableUserRole = (user: User | undefined): ReadableRole => {
  const role = getUserRole(user);

  switch (role) {
    case UserRole.SuperAdmin:
      return ReadableRole.SuperAdmin;

    case UserRole.GroupAdmin:
      return ReadableRole.GroupAdmin;

    case UserRole.HotelAdmin:
      return ReadableRole.HotelAdmin;

    default:
      return ReadableRole.HotelMember;
  }
};

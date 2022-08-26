import { UserRole } from '@hm/sdk';
import { ReadableRole } from './get-readable-user-role';

export const parseRole = (readableRole: ReadableRole): UserRole => {
  switch (readableRole) {
    case 'Hotel Manager':
      return UserRole.SuperAdmin;

    case 'Group Admin':
      return UserRole.GroupAdmin;

    case 'Hotel Admin':
      return UserRole.HotelAdmin;

    default:
      return UserRole.HotelMember;
  }
};

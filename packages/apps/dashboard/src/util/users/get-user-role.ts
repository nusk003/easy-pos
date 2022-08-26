import { User, UserRole } from '@hm/sdk';
import { useStore } from '@src/store';

export const getUserRole = (user: User | undefined): UserRole => {
  const hotelId = useStore.getState().hotelId;

  if (!user) {
    return UserRole.HotelMember;
  }

  if (user.hotelManager) {
    return UserRole.SuperAdmin;
  }

  if (user.groupAdmin) {
    return UserRole.GroupAdmin;
  }

  const hotelRole = user.roles.find((r) => r.hotel?.id === hotelId);

  if (hotelRole?.role === UserRole.HotelAdmin) {
    return UserRole.HotelAdmin;
  }

  return UserRole.HotelMember;
};

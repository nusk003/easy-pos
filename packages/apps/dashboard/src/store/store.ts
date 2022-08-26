import { BookingsSettings, RegisterGroupAdminMutationVariables } from '@hm/sdk';
import { WebSocketSDK } from '@src/xhr';
import create from 'zustand';
import { configurePersist } from 'zustand-persist';

const { persist, purge } = configurePersist({
  storage: localStorage,
  rootKey: 'z',
});

export type RootState = {
  hotelId: string;
  setHotelId: (state: RootState['hotelId']) => void;

  pageTitle: string;
  setPageTitle: (state: RootState['pageTitle']) => void;

  apaleoState: string | undefined;
  setApaleoState: (state: RootState['apaleoState']) => void;

  createAccount: Partial<RegisterGroupAdminMutationVariables>;
  setCreateAccount: (
    state: Partial<RegisterGroupAdminMutationVariables>
  ) => void;

  bookingsSettings: BookingsSettings | undefined;
  setBookingsSettings: (
    bookingsSettings: RootState['bookingsSettings']
  ) => void;

  loggedIn: boolean;
  setLoggedIn: (state: RootState['loggedIn']) => void;

  lydJWT: string | undefined;
  setLydJWT: (state: RootState['lydJWT']) => void;

  userSettings: { notificationsAllowed: boolean };
  setUserSettings: (state: RootState['userSettings']) => void;

  WS: WebSocketSDK | null;
  setWS: (state: RootState['WS']) => void;

  WSStatus: 'open' | 'closed';
  setWSStatus: (state: RootState['WSStatus']) => void;

  supportChatVisible: boolean;
};

export const useStore = create<RootState>(
  persist(
    {
      key: 'z',
      denylist: [
        'pageTitle',
        'loggedIn',
        'createAccount',
        'WS',
        'WSStatus',
        'lydJWT',
        'bookingsSettings',
      ],
    },
    (set) => ({
      hotelId: '',
      setHotelId: async (state: RootState['hotelId']) => {
        set({ hotelId: state });
      },

      apaleoState: undefined,
      setApaleoState: (apaleoState) => set({ apaleoState }),

      bookingsSettings: undefined,
      setBookingsSettings: (state: RootState['bookingsSettings']) => {
        set({ bookingsSettings: state });
      },

      pageTitle: '',
      setPageTitle: (state: RootState['pageTitle']) => {
        set({ pageTitle: state });
      },

      createAccount: {},
      setCreateAccount: (state: RootState['createAccount']) => {
        set({ createAccount: state });
      },

      loggedIn: false,
      setLoggedIn: (state: RootState['loggedIn']) => {
        set({ loggedIn: state });
      },

      lydJWT: undefined,
      setLydJWT: (state: RootState['lydJWT']) => {
        set({ lydJWT: state });
      },

      userSettings: { notificationsAllowed: true },
      setUserSettings: (state: RootState['userSettings']) => {
        set({ userSettings: state });
      },

      WS: null,
      setWS: (state: RootState['WS']) => {
        set({ WS: state });
      },

      WSStatus: 'closed',
      setWSStatus: (state: RootState['WSStatus']) => {
        set({ WSStatus: state });
      },

      supportChatVisible: false,
    })
  )
);

export { purge };

import { Hotel } from '@hm/sdk';
import * as Sentry from '@sentry/react';
import { Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import { useStore } from '@src/store';
import { useHotel, useUser } from '@src/xhr/query';
import Fuse from 'fuse.js';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

const SWrapper = styled.div<{
  isDropdownVisible: boolean;
  isMenuVisible: boolean;
}>`
  width: 100%;
  height: ${(props) =>
    props.isDropdownVisible ? 'calc(100vh - 32px)' : '42px'};

  ${theme.mediaQueries.desktop} {
    display: ${(props) => (!props.isMenuVisible ? 'none' : undefined)};
    height: ${(props) =>
      props.isDropdownVisible ? 'calc(100vh - 32px - 25px)' : undefined};
  }

  transition: height 0.3s;
  user-select: none;
`;

const SButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
  gap: 8px;
  cursor: pointer;
  align-items: center;
`;

const SHotelLogoWrapper = styled.div`
  display: grid;
  height: 40px;
  width: 40px;
  border: 0.5px solid #bac8da;
  border-radius: 8px;
  align-content: center;
  justify-content: center;
`;

const SHotelLogo = styled.img`
  border-radius: 8px;
`;

const SDropdownButtonWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
  gap: 8px;
`;

const SHotelName = styled(Text.Primary)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SDropdownWrapper = styled.div<{ isDropdownVisible: boolean }>`
  display: grid;
  overflow: hidden;
  height: ${(props) =>
    props.isDropdownVisible ? 'calc(100vh - 99px)' : '0px'};
  margin-top: 24px;
  align-content: start;
  gap: 8px;

  ${theme.mediaQueries.desktop} {
    height: ${(props) =>
      props.isDropdownVisible ? 'calc(100vh - 99px - 25px)' : '0px'};
  }

  transition: height 0.3s;
`;

const SDropdownHotel = styled(Text.Body)<{ active: boolean }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  cursor: pointer;
  user-select: none;
  background-color: ${(props) => (props.active ? '#f2f2f2' : undefined)};

  :hover {
    background-color: #f2f2f2;
  }
`;

interface Props {
  isMenuVisible: boolean;
}

export const SidebarHotelSelector: React.FC<Props> = ({ isMenuVisible }) => {
  const { data: user } = useUser();
  const { data: hotel, isValidating: isHotelValidating } = useHotel();

  const { hotelId } = useStore(
    useCallback(
      (state) => ({
        hotelId: state.hotelId,
      }),
      []
    )
  );

  const searchRef = useRef<HTMLInputElement>(null);

  const [hotels, setHotels] = useState(user?.hotels || []);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isIconLoaded, setIsIconLoaded] = useState(false);

  const sortHotels = useCallback(
    (hotels: Hotel[]) => {
      return hotels.sort((hotel) => {
        if (hotel.id === hotelId) {
          return -1;
        }

        return 0;
      });
    },
    [hotelId]
  );

  useEffect(() => {
    if (user?.hotels) {
      setHotels(sortHotels(user.hotels));
    }
  }, [sortHotels, user?.hotels]);

  const fuse = useMemo(() => {
    if (!user?.hotels) {
      return undefined;
    }

    return new Fuse(sortHotels(user.hotels), {
      keys: ['name'],
    });
  }, [sortHotels, user?.hotels]);

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    if (!user || !fuse) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const { value } = target;

    if (!value) {
      setHotels(sortHotels(user.hotels));
      return;
    }

    const searchResult = fuse.search(value);

    const searchHotels = searchResult.map(({ item }) => {
      return item;
    });

    setHotels(searchHotels);
  };

  const handleToggleDropdown = () => {
    setIsDropdownVisible((s) => !s);
  };

  const handleChangeHotel = useCallback(
    (id: string) => {
      const { setHotelId } = useStore.getState();
      sessionStorage.setItem('update-key', 'true');

      setImmediate(() => {
        setIsIconLoaded(false);
        setHotelId(id);

        if (searchRef.current?.value) {
          searchRef.current.value = '';
        }

        if (user?.hotels) {
          setHotels(user.hotels);
        }
      });
    },
    [user?.hotels]
  );

  const selectedHotel = useMemo(
    () => user?.hotels?.find((hotel) => hotel.id === hotelId),
    [hotelId, user?.hotels]
  );

  useEffect(() => {
    if (process.env.REACT_APP_STAGE !== 'development') {
      Sentry.configureScope((scope) => {
        scope.setTag('hotelId', selectedHotel?.id || '');
      });
    }
  }, [selectedHotel]);

  return (
    <SWrapper
      isDropdownVisible={isDropdownVisible}
      isMenuVisible={isMenuVisible}
    >
      <SButtonWrapper onClick={handleToggleDropdown}>
        <SHotelLogoWrapper>
          {!isIconLoaded && isHotelValidating ? (
            <MoonLoader size={16} />
          ) : (
            <SHotelLogo
              src={
                hotel?.app?.metadata?.icon ||
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
              }
              height={hotel?.app?.metadata?.icon ? 40 : 24}
              width={hotel?.app?.metadata?.icon ? 40 : 24}
              onLoad={() => setIsIconLoaded(true)}
            />
          )}
        </SHotelLogoWrapper>

        <SDropdownButtonWrapper>
          <SHotelName color={theme.textColors.gray} fontWeight="semibold">
            {selectedHotel ? selectedHotel.name : 'Loading Hotel'}
          </SHotelName>
          {isDropdownVisible ? (
            <FiChevronUp size={12} />
          ) : (
            <FiChevronDown size={12} />
          )}
        </SDropdownButtonWrapper>
      </SButtonWrapper>

      <SDropdownWrapper isDropdownVisible={isDropdownVisible}>
        <Inputs.BasicSearch
          wrapperStyle={{ marginBottom: 16 }}
          onChange={handleSearch}
          ref={searchRef}
        />
        {hotels.map((hotel) => (
          <SDropdownHotel
            key={hotel.id}
            onClick={() => handleChangeHotel(hotel.id)}
            active={hotel.id === hotelId}
          >
            {hotel.name}
          </SDropdownHotel>
        ))}
      </SDropdownWrapper>
    </SWrapper>
  );
};

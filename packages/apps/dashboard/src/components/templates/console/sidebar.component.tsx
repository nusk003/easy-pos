import { BookingStatus } from '@hm/sdk';
import { ReactComponent as GuestsIcon } from '@src/assets/icons/sidebar/guests.svg';
import { ReactComponent as DashboardIcon } from '@src/assets/icons/sidebar/home.svg';
import { ReactComponent as MessagesIcon } from '@src/assets/icons/sidebar/messages.svg';
import { ReactComponent as PointsOfInterestIcon } from '@src/assets/icons/sidebar/points-of-interest.svg';
import { ReactComponent as SettingsIcon } from '@src/assets/icons/sidebar/settings.svg';
import { ReactComponent as SpacesIcon } from '@src/assets/icons/sidebar/spaces.svg';
import { Feature, Grid, Text } from '@src/components/atoms';
import {
  SidebarHotelSelector,
  SidebarMenuItem,
  SidebarProfile,
} from '@src/components/organisms';
import { SidebarSubmenuItem } from '@src/components/organisms/console/sidebar/sidebar-submenu-item.component';
import { TitleBar } from '@src/components/shell';
import { theme } from '@src/components/theme';
import { __electron__, __macos__ } from '@src/constants';
import { useFlags } from '@src/util/features';
import {
  useBookingsAnalytics,
  useOrders,
  useUnreadThreadCount,
} from '@src/xhr/query';
import { useSearchBookings } from '@src/xhr/query/search-bookings.query';
import React, { useCallback, useMemo, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

const SWrapper = styled.div<{ isMenuVisible: boolean }>`
  display: grid;
  width: calc(225px - 32px);
  border-right: 0.5px solid #e8eaef;
  padding: 16px;
  align-content: space-between;
  overflow: hidden;
  background: #fff;

  transition: width 0.3s;

  ${theme.mediaQueries.desktop} {
    height: ${__electron__ && __macos__ ? 'calc(100vh - 64px)' : undefined};
    width: ${(props) =>
      !props.isMenuVisible ? 'calc(52px - 32px)' : undefined};
  }

  ${theme.mediaQueries.tablet} {
    padding: ${(props) => (!props.isMenuVisible ? 0 : undefined)};
    position: fixed;
    top: ${(props) => (!props.isMenuVisible ? '24px' : undefined)};
    left: ${(props) => (!props.isMenuVisible ? '16px' : undefined)};
    border-right: ${(props) => (!props.isMenuVisible ? 'none' : undefined)};
    height: ${(props) =>
      !props.isMenuVisible ? undefined : 'calc(100vh - 36px)'};
    transition: width 0s;

    z-index: 100000;
  }

  ${theme.mediaQueries.mobile} {
    width: ${(props) =>
      props.isMenuVisible ? 'calc(100vw - 32px)' : undefined};
  }
`;

const SDivider = styled.div`
  display: grid;
  align-content: start;
`;

const SBurger = styled(GiHamburgerMenu)<{ isMenuVisible: boolean }>`
  cursor: pointer;
  display: none;
  margin-left: 4px;
  color: ${theme.textColors.gray};

  ${theme.mediaQueries.desktop} {
    display: block;
    margin-bottom: ${(props) => (props.isMenuVisible ? '12px' : undefined)};
  }

  ${theme.mediaQueries.tablet} {
    margin-top: ${(props) => (props.isMenuVisible ? '8px' : undefined)};
  }
`;

interface SMenusItemsWrapperProps extends SpaceProps {
  isMenuVisible: boolean;
}

const SMenusItemsWrapper = styled.div<SMenusItemsWrapperProps>`
  display: grid;
  gap: 8px;

  ${space}

  ${theme.mediaQueries.desktop} {
    margin-left: ${(props) => (!props.isMenuVisible ? '-6px' : undefined)};
  }

  ${theme.mediaQueries.tablet} {
    display: ${(props) => (!props.isMenuVisible ? 'none' : undefined)};
  }
`;

const BadgeNotificationLoader: React.FC = () => {
  useUnreadThreadCount();
  useSearchBookings({
    status: BookingStatus.Submitted,
  });
  useOrders();

  return null;
};

interface Props {
  hotelIdKey: string;
  onSupportClick: () => void;
  isSupportVisible: boolean;
}

export const Sidebar: React.FC<Props> = ({
  hotelIdKey,
  onSupportClick,
  isSupportVisible,
}) => {
  const flags = useFlags();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setIsMenuVisible((s) => !s);
  }, []);

  const handleMenuItemClick = () => {
    const { width } = window.screen;

    if (width <= 768) {
      setIsMenuVisible(false);
    }
  };

  const menuItemProps = useMemo(() => {
    return { isMenuVisible };
  }, [isMenuVisible]);

  const submenuItemProps = useMemo(() => {
    return { onClick: handleMenuItemClick };
  }, []);

  const handleSupportClick = () => {
    handleMenuItemClick();
    onSupportClick();
  };

  const { data: unreadThreadCountData } = useUnreadThreadCount();
  const unreadThreadCount = unreadThreadCountData || 0;

  const { data: bookingAnalytics } = useBookingsAnalytics({});

  const submittedBookingsCount = bookingAnalytics?.noSubmittedBookings || 0;

  const { data: orders } = useOrders();

  const activeOrdersCount = orders?.length || 0;

  const totalNotifications =
    unreadThreadCount + submittedBookingsCount + activeOrdersCount;

  if (
    searchParams.get('hide_sidebar')?.toLowerCase() === 'true' ||
    window.sessionStorage.getItem('hideSidebar') === 'true'
  ) {
    return null;
  }

  return (
    <SWrapper isMenuVisible={isMenuVisible}>
      <SDivider>
        <TitleBar sidebar />
        <SBurger onClick={handleToggleMenu} isMenuVisible={isMenuVisible} />
        <SidebarHotelSelector isMenuVisible={isMenuVisible} />

        <SMenusItemsWrapper isMenuVisible={isMenuVisible} mt="24px">
          <SidebarMenuItem
            {...menuItemProps}
            title="Dashboard"
            icon={DashboardIcon}
            location="/"
            badgeCount={totalNotifications}
            onClick={handleMenuItemClick}
          />
          {/* <SidebarMenuItem
            {...menuItemProps}
            title="Manage"
            icon={SettingsIcon}
            location="/manage"
            onClick={handleMenuItemClick}
          /> */}
        </SMenusItemsWrapper>

        <SMenusItemsWrapper isMenuVisible={isMenuVisible} mt="40px">
          <Feature name="messages">
            <SidebarMenuItem
              {...menuItemProps}
              title="Messages"
              icon={MessagesIcon}
              badgeCount={unreadThreadCount}
            >
              <SidebarSubmenuItem
                {...submenuItemProps}
                title="Chat"
                matchedLocations={['/messages/:messageId/']}
                location="/messages"
                badgeCount={unreadThreadCount}
              />
            </SidebarMenuItem>
          </Feature>

          <Feature name="products">
            <SidebarMenuItem
              {...menuItemProps}
              title="Inventory"
              icon={MessagesIcon}
              badgeCount={unreadThreadCount}
            >
              <SidebarSubmenuItem
                {...submenuItemProps}
                title="Products"
                matchedLocations={['/products/:productId/']}
                location="/products"
                // badgeCount={unreadThreadCount}
              />
            </SidebarMenuItem>
          </Feature>

          <SidebarMenuItem
            {...menuItemProps}
            title="Customers"
            icon={GuestsIcon}
            badgeCount={submittedBookingsCount}
          >
            {/* <Feature name="bookings">
              <SidebarSubmenuItem
                {...submenuItemProps}
                title="Bookings"
                location="/bookings"
                badgeCount={submittedBookingsCount}
              />
            </Feature> */}

            <SidebarSubmenuItem
              {...submenuItemProps}
              title="Profiles"
              matchedLocations={['/customers/:customerId/']}
              location="/customers"
            />
          </SidebarMenuItem>

          {flags.orders ? (
            <SidebarMenuItem
              {...menuItemProps}
              title="Sales & Payments"
              icon={SpacesIcon}
              badgeCount={activeOrdersCount}
            >
              <Feature name="spaces">
                <SidebarSubmenuItem
                  {...submenuItemProps}
                  title="Menus"
                  location="/sales"
                  matchedLocations={['/pricelists/:pricelistId/']}
                  locationsBlacklist={[
                    '/pricelists/discounts',
                    '/pricelists/reviews',
                  ]}
                />
              </Feature>
              <Feature name="orders">
                <SidebarSubmenuItem
                  {...submenuItemProps}
                  title="Sales"
                  location="/sales"
                  badgeCount={activeOrdersCount}
                />
              </Feature>
              <Feature name="spaces">
                <SidebarSubmenuItem
                  {...submenuItemProps}
                  title="Discounts"
                  location="/pricelists/discounts"
                />
              </Feature>
              <Feature name="spaces">
                <SidebarSubmenuItem
                  {...submenuItemProps}
                  title="Feedback"
                  location="/pricelists/reviews"
                />
              </Feature>
            </SidebarMenuItem>
          ) : null}

          <Feature name="pointsOfInterest">
            <SidebarMenuItem
              {...menuItemProps}
              title="Experiences"
              icon={PointsOfInterestIcon}
            >
              <SidebarSubmenuItem
                {...submenuItemProps}
                title="Points of Interest"
                location="/points-of-interest"
              />
            </SidebarMenuItem>
          </Feature>
        </SMenusItemsWrapper>

        <BadgeNotificationLoader key={hotelIdKey} />
      </SDivider>

      <SDivider>
        <Feature name="support">
          <SMenusItemsWrapper isMenuVisible={isMenuVisible}>
            <SidebarMenuItem
              {...menuItemProps}
              onClick={handleSupportClick}
              title={!isSupportVisible ? 'Need help?' : 'Close'}
              icon={
                !isSupportVisible
                  ? GuestsIcon
                  : () => (
                      <Grid alignItems="center" justifyItems="center">
                        <Text.Body fontWeight="semibold">✕</Text.Body>
                      </Grid>
                    )
              }
            />
          </SMenusItemsWrapper>
        </Feature>

        <SidebarProfile isMenuVisible={isMenuVisible} />
      </SDivider>
    </SWrapper>
  );
};

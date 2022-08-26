import { useFlags } from '@src/util/features';
import { useHotel, useUser } from '@src/xhr/query';
import React from 'react';
import { Route, Switch } from 'react-router';
import { ManageAppAppStore } from './app/manage-app-app-store.component';
import { ManageAppBranding } from './app/manage-app-branding.component';
import { ManageAppDomain } from './app/manage-app-domain.component';
import { ManageAppPreferences } from './app/manage-app-preferences.component';
import { ManageAppQRCode } from './app/manage-app-qr-code.component';
import { ManageCustomForm } from './custom/manage-custom-form.component';
import { ManageCustom } from './custom/manage-custom.component';
import { ManageExperiencesPointsOfInterest } from './experiences/manage-experiences-points-of-interest.component';
import { ManageFoodBeverageMenu } from './food-beverage/manage-food-beverage-menu.component';
import { ManageApp } from './manage-app.component';
import { ManageBookings } from './manage-bookings.component';
import { ManageDeveloperMarketplaceApp } from './manage-developer-marketplace-app.component';
import { ManageExperiences } from './manage-experiences.component';
import { ManageFoodBeverage } from './manage-food-beverage.component';
import { ManageHome } from './manage-home.component';
import { ManageHotel } from './manage-hotel.component';
import { ManageMarketplace } from './manage-marketplace.component';
import { ManageMessages } from './manage-messages.component';
import { ManageNotifications } from './manage-notifications.component';
import { ManagePayments } from './manage-payments.component';
import { ManageProfile } from './manage-profile.component';
import { ManageSpaces } from './manage-spaces.component';
import { ManageTeam } from './manage-team.component';
import { ManageSpacesAll } from './spaces/manage-spaces-all.component';
import { ManageSpacesForm } from './spaces/manage-spaces-form.component';

export const Manage: React.FC = () => {
  const { data: hotel } = useHotel();
  const { data: user } = useUser();

  const flags = useFlags();

  return (
    <Switch>
      <Route exact path="/manage" component={ManageHome} />

      <Route exact path="/manage/hotel" component={ManageHotel} />

      {hotel?.countryCode === 'GB' && flags.payments ? (
        <Route path="/manage/payments" component={ManagePayments} />
      ) : null}

      {flags.launchkit ? (
        <Route exact path="/manage/app" component={ManageApp} />
      ) : null}
      {flags.launchkit ? (
        <Route
          exact
          path="/manage/app/app-store"
          component={ManageAppAppStore}
        />
      ) : null}
      {flags.launchkit ? (
        <Route
          exact
          path="/manage/app/branding"
          component={ManageAppBranding}
        />
      ) : null}
      {flags.launchkit ? (
        <Route exact path="/manage/app/qr-code" component={ManageAppQRCode} />
      ) : null}
      {flags.launchkit ? (
        <Route
          exact
          path="/manage/app/preferences"
          component={ManageAppPreferences}
        />
      ) : null}
      <Route exact path="/manage/app/domain" component={ManageAppDomain} />

      <Route exact path="/manage/team" component={ManageTeam} />

      {flags.marketplace ? (
        <Route path="/manage/marketplace" component={ManageMarketplace} />
      ) : null}

      {flags.spaces ? (
        <Route exact path="/manage/spaces" component={ManageSpaces} />
      ) : null}
      {flags.spaces ? (
        <Route exact path="/manage/spaces/all" component={ManageSpacesAll} />
      ) : null}
      {flags.spaces ? (
        <Route exact path="/manage/spaces/space" component={ManageSpacesForm} />
      ) : null}
      {flags.spaces ? (
        <Route
          exact
          path="/manage/food-beverage"
          component={ManageFoodBeverage}
        />
      ) : null}
      {flags.spaces ? (
        <Route
          exact
          path="/manage/food-beverage/menu"
          component={ManageFoodBeverageMenu}
        />
      ) : null}

      {flags.messages ? (
        <Route exact path="/manage/messages" component={ManageMessages} />
      ) : null}

      {flags.bookings ? (
        <Route path="/manage/bookings" component={ManageBookings} />
      ) : null}

      {flags.pointsOfInterest ? (
        <Route exact path="/manage/experiences" component={ManageExperiences} />
      ) : null}
      {flags.pointsOfInterest ? (
        <Route
          exact
          path="/manage/experiences/points-of-interest"
          component={ManageExperiencesPointsOfInterest}
        />
      ) : null}
      <Route exact path="/manage/custom" component={ManageCustom} />
      <Route exact path="/manage/custom/link" component={ManageCustomForm} />

      <Route exact path="/manage/profile" component={ManageProfile} />

      <Route
        exact
        path="/manage/notifications"
        component={ManageNotifications}
      />

      {user?.developer ? (
        <Route
          exact
          path="/manage/developer/marketplace-app"
          component={ManageDeveloperMarketplaceApp}
        />
      ) : null}
    </Switch>
  );
};

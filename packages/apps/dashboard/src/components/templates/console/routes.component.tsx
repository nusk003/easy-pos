import { Feature } from '@src/components/atoms';
import { CustomersAll } from '@src/components/pages/customers';
import { Dashboard } from '@src/components/pages/dashboard';
import { ProductsAll } from '@src/components/pages/products';
import { Sale, SalesAll, SalesCreate } from '@src/components/pages/sales';
import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

const Manage = React.lazy(() =>
  import('@src/components/pages/manage').then((module) => ({
    default: module.Manage,
  }))
);

const GuestsAll = React.lazy(() =>
  import('@src/components/pages/guests').then((module) => ({
    default: module.GuestsAll,
  }))
);

const Guest = React.lazy(() =>
  import('@src/components/pages/guests').then((module) => ({
    default: module.Guest,
  }))
);

const Pricelist = React.lazy(() =>
  import('@src/components/pages/pricelists').then((module) => ({
    default: module.Pricelist,
  }))
);

const PricelistsAll = React.lazy(() =>
  import('@src/components/pages/pricelists').then((module) => ({
    default: module.PricelistsAll,
  }))
);

const PricelistsDiscounts = React.lazy(() =>
  import('@src/components/pages/pricelists').then((module) => ({
    default: module.PricelistsDiscounts,
  }))
);

const PricelistsReviews = React.lazy(() =>
  import('@src/components/pages/pricelists').then((module) => ({
    default: module.PricelistsReviews,
  }))
);

const PointsOfInterest = React.lazy(() =>
  import('@src/components/pages/points-of-interest').then((module) => ({
    default: module.PointsOfInterest,
  }))
);

const Orders = React.lazy(() =>
  import('@src/components/pages/orders').then((module) => ({
    default: module.Orders,
  }))
);

const Messages = React.lazy(() =>
  import('@src/components/pages/messages').then((module) => ({
    default: module.Messages,
  }))
);

const Bookings = React.lazy(() =>
  import('@src/components/pages/bookings').then((module) => ({
    default: module.Bookings,
  }))
);

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Suspense fallback={null}>
        <Route exact path="/" component={Dashboard} />
        <Route path="/manage" component={Manage} />
        <Route exact path="/customers" component={CustomersAll} />
        <Route exact path="/products" component={ProductsAll} />
        <Route exact path="/guests/:guestId" component={Guest} />
        <Feature name="messages">
          <Route path="/messages" component={Messages} />
        </Feature>
        <Feature name="bookings">
          <Route exact path="/bookings" component={Bookings} />
        </Feature>
        <Feature name="spaces">
          <Switch>
            <Route exact path="/pricelists/" component={PricelistsAll} />
            <Route
              exact
              path="/pricelists/discounts"
              component={PricelistsDiscounts}
            />
            <Route
              exact
              path="/pricelists/reviews"
              component={PricelistsReviews}
            />
            <Route
              exact
              path="/pricelists/:pricelistId"
              component={Pricelist}
            />
          </Switch>
        </Feature>
        <Feature name="orders">
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/sales" component={SalesAll} />
          <Route exact path="/sales/create" component={SalesCreate} />
          <Route exact path="/sale/:id" component={Sale} />
        </Feature>
        <Feature name="pointsOfInterest">
          <Route
            exact
            path="/points-of-interest"
            component={PointsOfInterest}
          />
        </Feature>
      </Suspense>
    </Switch>
  );
};

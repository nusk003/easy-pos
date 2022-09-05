import { Guest, Product, SearchProductsQueryVariables } from '@hm/sdk';
import { Button, Grid, Link, Text } from '@src/components/atoms';
import { Inputs, Table } from '@src/components/molecules';
import { Header, ProductsModal } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useSearchProducts } from '@src/xhr/query';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SWrapper = styled.div`
  padding: 32px;
  padding-right: 16px;
  padding-bottom: 0;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    padding-bottom: 0;
    padding-right: 0;
  }
`;

export const ProductsAll: React.FC = () => {
  const location = useLocation<{ guestId: string } | undefined>();

  const [visibleProductsModal, setVisibleProductsModal] =
    useState<boolean>(false);

  const [product, setProduct] = useState<Product | undefined>(undefined);

  const history = useHistory();

  const [query, setQuery] = useState<SearchProductsQueryVariables>({
    limit: 7,
    offset: 0,
    query: null,
  });
  const [products, setProducts] = useState<Product[]>();

  const { data, mutate: mutateProducts } = useSearchProducts(query);
  const count = data?.count;

  useEffect(() => {
    if (data?.data) {
      setProducts(data.data as Product[]);
    }
  }, [data?.data]);

  const handleSearchQueryChange = _.debounce((searchQuery: string) => {
    searchQuery = searchQuery.replace(/#/g, '');
    setQuery((s) => ({ ...s, query: searchQuery }));
  }, 300);

  const handlePage = (direction: 'next' | 'prev') => {
    if (count === undefined) {
      return;
    }

    setQuery((s) => {
      let offset = s.offset || 0;

      if (direction === 'next' && offset + 7 <= count) {
        offset += 7;
      } else if (direction === 'prev' && offset !== 0) {
        offset -= 7;
      }

      return { ...s, offset };
    });
  };

  useEffect(() => {
    if (location.state) {
      setQuery((s) => ({ ...s, searchTerm: location.state?.guestId }));
    }
  }, [location.state]);

  return (
    <>
      <Header
        title="Products"
        primaryButton={
          <Button
            buttonStyle="primary"
            leftIcon={<FaLocationArrow size={10} />}
            onClick={() => setVisibleProductsModal(true)}
          >
            Add Product
          </Button>
        }
      />
      <ProductsModal
        visible={visibleProductsModal}
        onClose={async (mutate) => {
          if (mutate) await mutateProducts();
          setTimeout(() => {
            setProduct(undefined);
          }, 200);
          setVisibleProductsModal(false);
        }}
        product={product}
      />
      <SWrapper>
        <Table.Provider>
          <Table.Header justifyContent="space-between">
            <Inputs.BasicText
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearchQueryChange(e.target.value)
              }
              search
              name="allProductsSearch"
              autoComplete="off"
            />
          </Table.Header>
          <Table.Body>
            {products?.length ? (
              products.map((product) => {
                return (
                  <Table.Row
                    key={product.id}
                    onClick={() => {
                      setProduct({ ...product });
                      setVisibleProductsModal(true);
                    }}
                  >
                    <>
                      <Table.Cell>
                        <Grid
                          gridAutoFlow="column"
                          gridGap="8px"
                          justifyContent="start"
                          alignItems="center"
                        >
                          <div>
                            <Text.Body fontWeight="semibold">
                              {product.name}
                            </Text.Body>
                            <Text.Body fontWeight="semibold">
                              {product.code}
                            </Text.Body>
                          </div>
                        </Grid>
                      </Table.Cell>
                      <Table.Cell>
                        <Text.Body fontWeight="semibold">
                          Stock: {product.stock}
                        </Text.Body>
                      </Table.Cell>
                    </>
                    <Table.Cell>
                      <Grid
                        gridAutoFlow="column"
                        gridGap="8px"
                        justifyContent="start"
                        alignItems="center"
                      >
                        <div>
                          <Text.Body fontWeight="semibold">
                            Sell: Rs.{product.sellPrice?.toFixed(2)}
                          </Text.Body>
                          <Text.Body>
                            Cost: Rs.{product.costPrice?.toFixed(2)}
                          </Text.Body>
                        </div>
                      </Grid>
                    </Table.Cell>
                    <Table.Cell>
                      <Text.Body fontWeight="semibold">
                        Updated: {dayjs(product.dateUpdated).format('DD/MM/YY')}
                      </Text.Body>
                      <Text.Body>
                        Created: {dayjs(product.dateCreated).format('DD/MM/YY')}
                      </Text.Body>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={9} style={{ textAlign: 'center' }}>
                  <Text.BodyBold>No results found</Text.BodyBold>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
          <Table.Footer>
            <Table.FooterCell>
              <Table.PaginationWrapper>
                <Table.PaginationButton
                  left
                  onClick={() => handlePage('prev')}
                />
                <Table.PaginationButton
                  right
                  onClick={() => handlePage('next')}
                />
              </Table.PaginationWrapper>
            </Table.FooterCell>
            <Table.FooterCell>
              <Text.Interactive textAlign="right">
                Page{' '}
                {query.limit && query.offset
                  ? (query.limit + query.offset) / query.limit
                  : 1}
              </Text.Interactive>
            </Table.FooterCell>
          </Table.Footer>
        </Table.Provider>
      </SWrapper>
    </>
  );
};

import { Grid, Link, Tag, Text, toast } from '@src/components/atoms';
import { Inputs, Verify } from '@src/components/molecules';
import {
  Form,
  Header,
  ManageFormSection,
  ManageFormWrapper,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { __stage__ } from '@src/constants';
import { sdk } from '@src/xhr/graphql-request';
import { useCustomDomain, useHotel } from '@src/xhr/query';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import styled from 'styled-components';

const domainRegex = new RegExp(
  '^([a-zA-Z0-9]([-a-zA-Z0-9]{0,61}[a-zA-Z0-9])?.)?([a-zA-Z0-9]([-a-zA-Z0-9]{0,252}[a-zA-Z0-9])?).([a-zA-Z]{2,63}).([a-zA-Z]{2,63})$'
);

const SDNSRecordsWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: start;
  gap: 8px 32px;
  align-items: center;
`;

type FormValues = {
  domain: string;
};

export const ManageAppDomain = () => {
  const { data: hotel, mutate: mutateHotel } = useHotel();
  const {
    data: customDomain,
    mutate: mutateCustomDomain,
    isValidating: isCustomDomainValidating,
  } = useCustomDomain();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [
    isDeleteCustomDomainVerifyVisible,
    setIsDeleteCustomDomainVerifyVisible,
  ] = useState(false);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      domain: hotel?.app?.domain || undefined,
    },
  });

  const handleSubmit = async (formValues: FormValues) => {
    const domain = formValues.domain
      .replace('https://', '')
      .replace('http://', '')
      .trim();

    if (!domainRegex.test(domain)) {
      toast.warn('Please enter a valid domain');
      return;
    }

    setSubmitLoading(true);

    try {
      await sdk.addCustomDomain({
        domain,
      });
      toast.info('Successfully updated custom domain');
      await mutateHotel();
      await mutateCustomDomain();
      formMethods.setValue('domain', domain);
    } catch {
      toast.warn('Unable to add custom domain');
    }

    setSubmitLoading(false);
  };

  const handleDeleteCustomDomain = async () => {
    setSubmitLoading(true);

    try {
      await sdk.deleteCustomDomain();
      toast.info('Successfully removed custom domain');
      await mutateHotel();
      await mutateCustomDomain();
      formMethods.setValue('domain', '');
    } catch {
      toast.warn('Unable to remove custom domain');
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <Header backgroundColor="#fafafa" title="Custom Domain" />
      <ManageFormWrapper>
        <ManageFormSection
          title="App Domain"
          description="Add a custom domain (e.g. app.hotel.com) to your app"
        >
          <FormContext {...formMethods}>
            <Form.Provider onSubmit={formMethods.handleSubmit(handleSubmit)}>
              <div>
                <Text.Body fontWeight="medium">App Domain</Text.Body>
                <Text.Descriptor mt="4px">
                  A custom domain allows guests to access your app via the
                  exisiting domain name of your website. After submitting your
                  desired domain additional configuration is required to your
                  DNS records to activate this feature. We currently only
                  support one-level subdomains (e.g. app.hotel.com).
                </Text.Descriptor>

                <Grid
                  gridAutoFlow="column"
                  justifyContent="start"
                  gridGap="16px"
                  alignItems="center"
                  mt="16px"
                >
                  <Inputs.Text
                    name="domain"
                    placeholder="elah.hotelmanager.co"
                    width="300px"
                  />
                  <Form.Submit loading={submitLoading}>Submit</Form.Submit>
                  {customDomain ? (
                    <Verify
                      modal
                      visible={isDeleteCustomDomainVerifyVisible}
                      type="delete"
                      buttonText="Remove"
                      title="Remove domain"
                      message="Are you sure you want to remove this domain?"
                      loading={submitLoading}
                      onVerify={handleDeleteCustomDomain}
                      onClose={() =>
                        setIsDeleteCustomDomainVerifyVisible(false)
                      }
                    >
                      <Link
                        disableOnClick={false}
                        onClick={() =>
                          setIsDeleteCustomDomainVerifyVisible(true)
                        }
                        color={theme.textColors.red}
                      >
                        Remove
                      </Link>
                    </Verify>
                  ) : null}
                </Grid>
              </div>
              {customDomain ? (
                <div>
                  <Grid
                    gridAutoFlow="column"
                    justifyContent="start"
                    alignContent="center"
                    gridGap="16px"
                    mb="16px"
                  >
                    <Tag
                      tagStyle={
                        customDomain.configured ? 'blue' : 'blue-border'
                      }
                    >
                      {customDomain.configured
                        ? 'Live'
                        : 'Awaiting Configuration'}
                    </Tag>
                    <Link
                      disableOnClick={false}
                      onClick={() => mutateCustomDomain()}
                    >
                      {!isCustomDomainValidating ? 'Refresh' : 'Loading'}
                    </Link>
                  </Grid>
                  <SDNSRecordsWrapper>
                    <Text.Body fontWeight="semibold" mb="4px">
                      Type
                    </Text.Body>
                    <Text.Body fontWeight="semibold" mb="4px">
                      Name
                    </Text.Body>
                    <Text.Body fontWeight="semibold" mb="4px">
                      Value
                    </Text.Body>

                    <Tag tagStyle="gray">A</Tag>
                    <Text.Body fontWeight="medium">
                      {customDomain.domain.split('.')[0]}
                    </Text.Body>
                    <Text.Body fontWeight="medium">
                      {__stage__ === 'production'
                        ? '66.51.121.11'
                        : '66.51.121.15'}
                    </Text.Body>

                    <Tag tagStyle="gray">AAAA</Tag>
                    <Text.Body fontWeight="medium">@</Text.Body>
                    <Text.Body fontWeight="medium">
                      {__stage__ === 'production'
                        ? '2a09:8280:1::6:2100'
                        : '2a09:8280:1::6:20fd'}
                    </Text.Body>
                  </SDNSRecordsWrapper>
                  <Text.Descriptor mt="16px">
                    Changes may take up to 72 hours to propagate
                  </Text.Descriptor>
                </div>
              ) : null}
            </Form.Provider>
          </FormContext>
        </ManageFormSection>
      </ManageFormWrapper>
    </>
  );
};

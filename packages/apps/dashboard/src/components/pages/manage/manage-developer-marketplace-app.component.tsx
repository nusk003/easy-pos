import { IntegrationType } from '@hm/sdk';
import { Badge, Button, Grid, Link, Text, toast } from '@src/components/atoms';
import { Card, Inputs } from '@src/components/molecules';
import {
  Form,
  Header,
  ManageFormSection,
  ManageFormWrapper,
} from '@src/components/templates';
import { theme } from '@src/components/theme';
import { __root_address__ } from '@src/constants';
import { validationResolver } from '@src/util/form';
import { validateDeveloperUrl } from '@src/util/validations';
import { sdk } from '@src/xhr/graphql-request';
import { useMarketplaceApp, useUser } from '@src/xhr/query';
import React, { useEffect, useMemo, useState } from 'react';
import { FormContext, useFieldArray, useForm } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';
import styled from 'styled-components';
import * as z from 'zod';
import { ManageDeveloeprMarketplaceAppKeyModal } from './developer/manage-developer-marketplace-app-key-modal.component';

const SFormSection = styled(Form.Provider).attrs({ as: 'div' })``;

const SDeleteButton = styled(AiFillDelete).attrs({
  fill: theme.textColors.blue,
})`
  cursor: pointer;
  user-select: none;
  margin-left: 16px;
  width: min-content;
`;

const SLink = styled(Link).attrs({})`
  word-break: break-all;
  width: fit-content;
`;

const SProcessItemWrapper = styled(Card).attrs({
  cardStyle: 'light-blue',
})`
  display: grid;
  grid-auto-flow: column;
  gap: 16px;
  align-items: center;
  justify-content: start;
`;

const SProcessWrapper = styled.div`
  display: grid;
  gap: 16px;
`;

const formSchema = z.object({
  enabled: z.boolean().optional(),
  name: z.string().nonempty('Please enter a name').max(50, 'Name is too long'),
  description: z
    .string()
    .nonempty('Please enter a description')
    .max(500, 'Description is too long'),
  type: z.nativeEnum(IntegrationType),
  logo: z
    .string()
    .nonempty('Please enter a logo URL')
    .refine(validateDeveloperUrl, 'Please enter a valid URL'),
  websiteURL: z
    .string()
    .nonempty('Please enter your website URL')
    .refine(validateDeveloperUrl, 'Please enter a valid URL'),
  documentationURL: z
    .string()
    .nonempty('Please enter your documentation URL')
    .refine(validateDeveloperUrl, 'Please enter a valid URL'),
  helpURL: z
    .string()
    .nonempty('Please enter your help/support URL')
    .refine(validateDeveloperUrl, 'Please enter a valid URL'),
  redirectURLs: z
    .array(
      z.object({
        value: z
          .string()
          .nonempty('Please enter a redirect URL')
          .refine(validateDeveloperUrl, 'Please enter a valid URL'),
      })
    )
    .nonempty('Please enter your redirect URLs')
    .min(1),
  connectLink: z
    .string()
    .nonempty('Please enter your marketplace connect link')
    .refine(validateDeveloperUrl, 'Please enter a valid URL'),
});

type FormValues = z.infer<typeof formSchema>;

export const ManageDeveloperMarketplaceApp: React.FC = () => {
  const { data: user } = useUser();
  const { data: marketplaceApp, mutate: mutateMarketplaceApp } =
    useMarketplaceApp({ where: { developer: user?.id || '' } }, !!user?.id);

  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const defaultValues = useMemo(() => {
    if (!marketplaceApp) {
      return undefined;
    }

    return {
      ...marketplaceApp,
      redirectURLs: marketplaceApp.redirectURLs.map((url) => ({
        value: url,
      })) as FormValues['redirectURLs'],
    } as FormValues & { id: string };
  }, [marketplaceApp]);

  const formMethods = useForm<FormValues>({
    defaultValues: defaultValues || { enabled: true },
    validationResolver,
    validationContext: formSchema,
  });

  const {
    fields: redirectURLFields,
    append: appendRedirectURL,
    remove: removeRedirectURL,
  } = useFieldArray({
    control: formMethods.control,
    name: 'redirectURLs',
  });

  const consentLink = `${__root_address__}/connect?marketplace_id=${marketplaceApp?.id}&redirect_url=${marketplaceApp?.redirectURLs[0]}`;

  useEffect(() => {
    if (!defaultValues) {
      appendRedirectURL({});
    }
  }, [appendRedirectURL, defaultValues]);

  const copyConsentLink = async () => {
    try {
      await navigator.clipboard.writeText(consentLink);
      toast.info('Successfully copied URL');
    } catch {
      toast.warn('Unable to copy URL');
    }
  };

  const handleSubmit = async (formValues: FormValues) => {
    const redirectURLs = formValues.redirectURLs.map((u) => u.value);

    delete (formValues as Partial<FormValues>).redirectURLs;

    try {
      setSubmitLoading(true);

      if (defaultValues) {
        const toastId = toast.loader('Updating marketplace app');
        await sdk.updateMarketplaceApp({
          where: { id: defaultValues.id },
          data: {
            ...formValues,
            redirectURLs,
          },
        });
        toast.update(toastId, 'Successfully updated marketplace app');
        await mutateMarketplaceApp();
      } else {
        const toastId = toast.loader('Creating marketplace app');
        await sdk.createMarketplaceApp({
          ...formValues,
          redirectURLs,
          live: false,
          enabled: true,
        });
        toast.update(toastId, 'Submitted marketplace app for review');
        await mutateMarketplaceApp();
      }
    } catch {
      toast.info(
        defaultValues
          ? 'Unable to update marketplace app'
          : 'Unable to submit marketplace app for review'
      );
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <FormContext {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Header
            backgroundColor="#fafafa"
            title="Marketplace App"
            primaryButton={
              <Button
                buttonStyle="primary"
                type="button"
                onClick={() =>
                  window.open(
                    'https://developer.hotelmanager.co/docs/introduction',
                    '_blank'
                  )
                }
              >
                Documentation
              </Button>
            }
          />

          <ManageFormWrapper>
            {defaultValues ? (
              <ManageFormSection
                title="Setup"
                description="Enable or disable your marketplace app"
              >
                <Text.Body fontWeight="semibold">
                  What would you like to set up?
                </Text.Body>
                <Inputs.Checkbox
                  toggle
                  name="enabled"
                  boldSideLabel
                  sideLabel="Enable marketplace app"
                  sideLabelDescription="Enable a connection between your app and Hotel Manager"
                />
              </ManageFormSection>
            ) : null}

            <ManageFormSection
              title="Get started"
              description="View details on how to get started with connecting to the Hotel Manager API"
            >
              <div>
                <Text.Body fontWeight="semibold">Documentation</Text.Body>
                <Text.Descriptor mt="4px">
                  Visit our developer documentation to get a more in-depth
                  understanding of how to connect to the Hotel Manager API.
                </Text.Descriptor>
                <SLink
                  disableOnClick={false}
                  onClick={() =>
                    window.open(
                      'https://developer.hotelmanager.co/docs/introduction',
                      '_blank'
                    )
                  }
                  mt="8px"
                >
                  developer.hotelmanager.co
                </SLink>
              </div>

              <Text.Body fontWeight="semibold">Overview</Text.Body>
              <SProcessWrapper>
                <SProcessItemWrapper>
                  <Badge count={1} bg="blue" />
                  <div>
                    <Text.Interactive fontWeight="semibold">
                      Consent Link
                    </Text.Interactive>
                    <Text.Descriptor mt="4px">
                      Hotel partners must provide consent to connect to your
                      application. Once they connect to your app they will be
                      taken to your redirect URL with an auth token search
                      parameter.
                    </Text.Descriptor>

                    {marketplaceApp ? (
                      <>
                        <SLink
                          disableOnClick={false}
                          onClick={() => window.open(consentLink, '_blank')}
                          mt="8px"
                        >
                          {consentLink}
                        </SLink>
                        <Button
                          type="button"
                          buttonStyle="secondary"
                          onClick={copyConsentLink}
                          mt="8px"
                        >
                          Copy Link
                        </Button>
                      </>
                    ) : (
                      <Text.Descriptor fontWeight="semibold" mt="4px">
                        Submit you app to get your consent link.
                      </Text.Descriptor>
                    )}
                  </div>
                </SProcessItemWrapper>

                <SProcessItemWrapper>
                  <Badge count={2} bg="blue" />
                  <div>
                    <Text.Interactive>Get an access key</Text.Interactive>
                    <Text.Descriptor mt="4px">
                      An access key is a requirement for making requests via the
                      API. You can get an access key once the hotel partner has
                      redirected to your app.
                    </Text.Descriptor>
                  </div>
                </SProcessItemWrapper>

                <SProcessItemWrapper>
                  <Badge count={3} bg="blue" />
                  <div>
                    <Text.Interactive>Querying the API</Text.Interactive>
                    <Text.Descriptor mt="4px">
                      You can now query the API using your access token. We look
                      forward to seeing the wonderful tools you bring to our
                      hotel partners.
                    </Text.Descriptor>
                  </div>
                </SProcessItemWrapper>
              </SProcessWrapper>
            </ManageFormSection>

            {marketplaceApp ? (
              <ManageFormSection
                title="Keys"
                description="Generate a new key for subscription signature validation"
              >
                <div>
                  <Text.Body fontWeight="semibold">Keys</Text.Body>
                  <Text.Descriptor mt="4px">
                    When you create a subscription via the Hotel Manager API,
                    you will recieve a webhook when a topic you&apos;re
                    subscribed to has any changes.
                  </Text.Descriptor>
                  <Text.Descriptor mt="4px">
                    One strategy to ensure that your endpoint is secure is to
                    verify the signature in the header of the request. Each
                    subscription has a header which hashes the payload with HMAC
                    using a generated key which can be used to validate the
                    origin of the request.
                  </Text.Descriptor>
                  <SLink
                    disableOnClick={false}
                    mt="8px"
                    onClick={() =>
                      window.open(
                        'https://developer.hotelmanager.co/docs/subscriptions',
                        '_blank'
                      )
                    }
                  >
                    More details on subscription security
                  </SLink>
                  <Text.Descriptor fontWeight="semibold" mt="8px">
                    Note: Generating a new key will invalidate any keys you have
                    previously generated.
                  </Text.Descriptor>
                </div>
                <Button
                  type="button"
                  buttonStyle="secondary"
                  onClick={() => setIsKeyModalVisible(true)}
                >
                  Generate new key
                </Button>
              </ManageFormSection>
            ) : null}

            <ManageFormSection
              title="Connection Details"
              description="Add your API connection details"
            >
              <SFormSection>
                <Inputs.Text
                  label="Marketplace Connect Link"
                  note='The marketplace connect link is the link hotel partners will be taken to after clicking "connect" on your store listing. You may choose to go straight to your Marketplace consent page which you can obtain if you have submitted your app.'
                  name="connectLink"
                  placeholder="https://app.developer.co/integrations/hotel-manager"
                />

                <div>
                  <Text.Body fontWeight="medium">Redirect URLs</Text.Body>
                  <Text.Descriptor mt="4px">
                    After successful authorization hotel partners will be
                    redirected to this URL with an auth token search parameter.
                  </Text.Descriptor>
                  {redirectURLFields.map((item, idx) => {
                    if (idx === 0) {
                      return (
                        <Inputs.Text
                          mt="16px"
                          name={`redirectURLs[${idx}].value`}
                          placeholder="https://app.developer.co/integrations/hotel-manager"
                        />
                      );
                    }

                    return (
                      <Grid
                        key={item.id}
                        mt="12px"
                        gridTemplateColumns="auto min-content"
                        alignItems="center"
                      >
                        <Inputs.Text
                          name={`redirectURLs[${idx}].value`}
                          placeholder="https://api.developer.co/integrations/hotel-manager"
                        />
                        <SDeleteButton onClick={() => removeRedirectURL(idx)} />
                      </Grid>
                    );
                  })}
                  <Link
                    mt="12px"
                    disableOnClick={false}
                    onClick={appendRedirectURL}
                  >
                    Add URL+
                  </Link>
                </div>
              </SFormSection>
            </ManageFormSection>

            <ManageFormSection
              title="Marketplace Listing"
              description="Add your app listing to our marketplace"
            >
              <SFormSection>
                <Inputs.Text
                  label="Name"
                  name="name"
                  placeholder="Hotel Manager"
                  maxCharacters={50}
                />
                <Inputs.Text
                  label="Description"
                  name="description"
                  multiLine
                  maxCharacters={500}
                  placeholder="Hotel Manager powers future-ready hotels to launch, manage and operate every part of their hotel online so they can supercharge revenues and deliver the on-demand experience guests expect."
                />
                <Inputs.Select
                  label="Type"
                  name="type"
                  items={[IntegrationType.Pos, IntegrationType.Pms]}
                />
                <Inputs.Text
                  label="Logo (URL)"
                  name="logo"
                  placeholder="https://cdn.hotelmanager.co/logo.png"
                />
                <Inputs.Text
                  label="Website"
                  name="websiteURL"
                  placeholder="https://hotelmanager.co/"
                />
                <Inputs.Text
                  label="Documentation Link"
                  name="documentationURL"
                  placeholder="https://hotelmanager.co/docs"
                />
                <Inputs.Text
                  label="Help/Support Link"
                  name="helpURL"
                  placeholder="https://hotelmanager.co/help"
                />
              </SFormSection>
            </ManageFormSection>

            <Form.Submit loading={submitLoading}>
              {defaultValues ? 'Save' : 'Submit for review'}
            </Form.Submit>
          </ManageFormWrapper>
        </form>
      </FormContext>

      <ManageDeveloeprMarketplaceAppKeyModal
        visible={isKeyModalVisible}
        onClose={() => setIsKeyModalVisible(false)}
        marketplaceApp={marketplaceApp}
      />
    </>
  );
};

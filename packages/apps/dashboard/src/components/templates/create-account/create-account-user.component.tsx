import { Button, Text, toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  CreateAccountForm,
  CreateAccountFormSectionInputWrapper,
  CreateAccountFormSection,
} from '@src/components/organisms';
import { Form } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import React, { useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useStore } from '@src/store';
import styled from 'styled-components';
import * as z from 'zod';
import { sdk } from '@src/xhr/graphql-request';
import {
  RegisterGroupAdminUserInput,
  RegisterHotelUserResponse,
} from '@hm/sdk';

const SNameInputWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 16px;
`;

const SDescriptorWrapper = styled.div`
  display: grid;
  grid-gap: 8px;
`;

const SInputDescriptor = styled(Text.Descriptor)`
  font-size: 12.5px;
  color: ${theme.textColors.lightGray};
`;

const SContinueButton = styled(Button)`
  width: 100%;
`;

export const CreateAccountUser: React.FC = () => {
  const history = useHistory();

  const {
    params: { userId },
  } = useRouteMatch<{ userId: string }>();

  const {
    createAccount: createAccountState,
    setCreateAccount,
    setLoggedIn,
  } = useStore(
    useCallback(
      (state) => ({
        createAccount: state.createAccount,
        setCreateAccount: state.setCreateAccount,
        setLoggedIn: state.setLoggedIn,
      }),
      []
    )
  );

  const formSchema = z.object({
    user: z.object({
      firstName: z.string().nonempty('Please enter your first name'),
      lastName: z.string().nonempty('Please enter your last name'),
      mobile: z.string().nonempty('Please enter your mobile number'),
      email: userId
        ? z.undefined()
        : z
            .string()
            .nonempty('Please enter your email')
            .email('Please enter a valid email'),
    }),
    termsAndConditions: z
      .boolean()
      .refine(
        (val: boolean) => val === true,
        'Please agree to our Terms & Conditions'
      ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const formMethods = useForm<FormValues>({
    defaultValues: {
      termsAndConditions: createAccountState.termsAndConditions,
      user: {
        email: createAccountState.user?.email,
        firstName: createAccountState.user?.firstName || undefined,
        lastName: createAccountState.user?.lastName || undefined,
        mobile: createAccountState.user?.mobile || undefined,
      },
    },
    validationResolver,
    validationContext: formSchema,
  });

  const submitForm = async (formValues: FormValues) => {
    const user = { ...createAccountState.user, ...formValues.user };

    if (userId) {
      try {
        const { registerHotelUser } = await sdk.registerHotelUser({
          id: userId,
          firstName: formValues.user.firstName,
          lastName: formValues.user.lastName,
          mobile: formValues.user.mobile,
          termsAndConditions: formValues.termsAndConditions,
        });

        if (registerHotelUser === RegisterHotelUserResponse.Conflict) {
          toast.info(
            'A user account has already been created using this invite link'
          );
          return;
        }

        if (registerHotelUser === RegisterHotelUserResponse.Success) {
          setLoggedIn(true);
          history.push('/');
          return;
        }
      } catch {
        toast.warn('Unable to create your account. Please try again later.');
      }
    } else {
      if (!user.email) {
        return;
      }

      try {
        const { userExists } = await sdk.userExists({
          where: { email: user.email },
        });

        if (userExists) {
          toast.info('Email already exists. Please try using another email.');
          return;
        }

        setCreateAccount({
          ...createAccountState,
          user: user as RegisterGroupAdminUserInput,
          termsAndConditions: true,
        });

        history.push('/create-account/hotel');
      } catch {
        toast.warn('Unable to process request. Please try again later.');
      }
    }
  };

  return (
    <CreateAccountForm title="Create an account">
      <FormContext {...formMethods}>
        <Form.Provider onSubmit={formMethods.handleSubmit(submitForm)}>
          <CreateAccountFormSection title="Confirm your details">
            <CreateAccountFormSectionInputWrapper>
              <SNameInputWrapper>
                <Inputs.Text name="user.firstName" placeholder="First name" />
                <Inputs.Text name="user.lastName" placeholder="Last name" />
              </SNameInputWrapper>
              {!userId ? (
                <Inputs.Text name="user.email" placeholder="Email" />
              ) : null}

              <SDescriptorWrapper>
                <Inputs.Text
                  name="user.mobile"
                  placeholder="Your mobile number"
                />

                <SInputDescriptor>
                  You may change this later if you need to in your Settings
                </SInputDescriptor>
              </SDescriptorWrapper>
            </CreateAccountFormSectionInputWrapper>
          </CreateAccountFormSection>
          <CreateAccountFormSection>
            <Inputs.Checkbox
              name="termsAndConditions"
              sideLabel="Agree to Terms & Conditions and Privacy Policy"
            />

            <SContinueButton buttonStyle="primary">
              {userId ? 'Create Account' : 'Continue'}
            </SContinueButton>
          </CreateAccountFormSection>
        </Form.Provider>
      </FormContext>
    </CreateAccountForm>
  );
};

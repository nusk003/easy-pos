import { HotelCustomLink } from '@hm/sdk';
import { Link, Text, toast } from '@src/components/atoms';
import { Inputs, Verify } from '@src/components/molecules';
import {
  Form,
  Header,
  ManageFormSection,
  ManageFormWrapper,
} from '@src/components/templates';
import { fileToBase64 } from '@src/util/file';
import { validationResolver } from '@src/util/form';
import { validateUrl } from '@src/util/validations';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import * as z from 'zod';

const formSchema = z.object({
  enabled: z.boolean(),
  name: z.string().nonempty('Please enter a name'),
  link: z.string().nonempty().refine(validateUrl, 'Please enter a valid link'),
});

type FormValues = z.infer<typeof formSchema>;

export const ManageCustomForm = () => {
  const history = useHistory();
  const { state } = useLocation<{ customLink?: HotelCustomLink }>();

  const { mutate: mutateHotel } = useHotel();

  const [isDeleteVerifyVisible, setIsDeleteVerifyVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [file, setFile] = useState<File>();

  const defaultValues = state?.customLink;

  const setupFormMethods = useForm<FormValues>({
    defaultValues,
    validationContext: formSchema,
    validationResolver,
  });

  const handleUploadFile = (file: File, setImage: () => void) => {
    setFile(file);
    setImage();
  };

  const handleSubmit = async (formValues: FormValues) => {
    setSubmitLoading(true);
    const toastId = toast.loader(
      defaultValues ? 'Updating custom link' : 'Creating custom link'
    );

    try {
      let photo: string | undefined = undefined;

      if (file) {
        photo = await fileToBase64(file);
      }

      if (defaultValues) {
        await sdk.updateCustomLink({
          where: { id: defaultValues.id },
          data: {
            ...formValues,
            photo,
          },
        });
        toast.update(toastId, 'Successfully updated custom link');
      } else {
        const customLink = { id: uuid(), ...formValues, photo };
        await sdk.addCustomLink(customLink);
        toast.update(toastId, 'Successfully created custom link');
        history.push('/manage/custom/link', { customLink });
      }

      await mutateHotel();
    } catch {
      await mutateHotel();
      toast.update(toastId, 'Unable to update custom link');
    }

    setSubmitLoading(false);
  };

  const handleDelete = async () => {
    if (!defaultValues) {
      return;
    }

    setSubmitLoading(true);

    const toastId = toast.loader('Removing custom link');

    try {
      await sdk.deleteCustomLink({ where: { id: defaultValues.id } });
      await mutateHotel();
      toast.update(toastId, 'Successfully removed custom link');
      setImmediate(() => {
        history.push('/manage/custom');
      });
    } catch {
      await mutateHotel();
      toast.update(toastId, 'Unable to remove custom link');
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <FormContext {...setupFormMethods}>
        <form onSubmit={setupFormMethods.handleSubmit(handleSubmit)}>
          <Header
            backgroundColor="#fafafa"
            title="Add custom link"
            onBack={() => history.push('/manage/custom')}
          />

          <ManageFormWrapper>
            <ManageFormSection
              title="Setup"
              description="Enable or disable custom link"
            >
              <Text.Body fontWeight="semibold">
                What would you like to set up?
              </Text.Body>
              <Inputs.Checkbox
                toggle
                name="enabled"
                boldSideLabel
                sideLabel="Enable custom link via app"
                sideLabelDescription="Embed custom link to other web pages"
              />

              {defaultValues ? (
                <Verify
                  type="delete"
                  onVerify={handleDelete}
                  visible={isDeleteVerifyVisible}
                  loading={submitLoading}
                  title="Remove custom link"
                  message="Are you sure you want to remove this custom link?"
                  modal
                  onClose={() => setIsDeleteVerifyVisible(false)}
                >
                  <Link
                    linkStyle="red"
                    disableOnClick={false}
                    onClick={() => setIsDeleteVerifyVisible(true)}
                  >
                    Delete
                  </Link>
                </Verify>
              ) : null}
            </ManageFormSection>

            <ManageFormSection
              title="General"
              description="Manage general settings for this custom link"
            >
              <Inputs.Text
                label="Name"
                placeholder="Book your next stay"
                name="name"
              />
              <Inputs.Text
                label="Link"
                placeholder="https://book.elah.com"
                name="link"
              />

              <Inputs.File
                label="Photo"
                name="photo"
                compressImage
                acceptOnlyImages
                defaultValue={defaultValues?.photo}
                onChange={handleUploadFile}
              />
            </ManageFormSection>
            <Form.Submit loading={submitLoading}>Save</Form.Submit>
          </ManageFormWrapper>
        </form>
      </FormContext>
    </>
  );
};

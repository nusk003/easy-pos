import { toast } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import {
  Header,
  ManageFormSection,
  ManageFormWrapper,
} from '@src/components/templates';
import { sdk } from '@src/xhr/graphql-request';
import { useHotel } from '@src/xhr/query';
import React from 'react';
import styled from 'styled-components';

const SFormWrapper = styled.div`
  display: grid;
  gap: 24px;
`;

export const ManageAppBranding = () => {
  const { data: hotel, mutate: mutateHotel } = useHotel();

  const handleChange = async (file: File, setImage: () => void) => {
    if (!file || !file.type.includes('image')) {
      toast.info('Please provide an image file type.');
      return;
    }

    const toastId = toast.loader('Uploading image');

    try {
      await sdk.uploadAppAsset({
        file,
      });
      toast.update(toastId, 'Successfully uploaded image.');
      setImage();
    } catch {
      toast.update(toastId, 'Unable to upload image.');
    }

    await mutateHotel();
  };

  return (
    <>
      <Header backgroundColor="#fafafa" title="App branding" />

      <ManageFormWrapper>
        <ManageFormSection
          title="Branding"
          description="Customize how your app appears to your guests"
        >
          <SFormWrapper>
            <Inputs.File
              defaultValue={hotel?.app?.assets?.featuredLogo || undefined}
              name="featuredLogo"
              label="Featured logo"
              note="The featured logo will be displayed on the header of your
                app's home screen."
              onChange={handleChange}
            />

            <Inputs.File
              defaultValue={hotel?.app?.assets?.featuredImage || undefined}
              name="featuredImage"
              label="Featured image"
              note="The featured image is displayed as a header on your app."
              onChange={handleChange}
            />

            <Inputs.File
              defaultValue={hotel?.app?.metadata?.icon || undefined}
              name="icon"
              label="App Icon"
              note="The app icon is used for publishing to the app store and is the icon users will see on their home screen."
              onChange={handleChange}
            />
          </SFormWrapper>
        </ManageFormSection>
      </ManageFormWrapper>
    </>
  );
};

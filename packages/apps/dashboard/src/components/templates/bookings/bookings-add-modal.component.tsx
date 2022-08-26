import { AgeGroup, Guest } from '@hm/sdk';
import { Text, toast } from '@src/components/atoms';
import { CountryPicker, Inputs, Modal } from '@src/components/molecules';
import { SearchItem } from '@src/components/molecules/inputs/search.component';
import { FormInputs } from '@src/components/organisms';
import { Form } from '@src/components/templates';
import countryData from '@src/components/templates/create-account/country-data.json';
import { validationResolver } from '@src/util/form';
import { sdk } from '@src/xhr/graphql-request';
import dayjs, { extend } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import * as z from 'zod';

extend(utc);

const formSchema = z.object({
  party: z.array(
    z.object({
      id: z.string(),
      firstName: z.string().nonempty("Please enter the guest's first name"),
      lastName: z.string().nonempty("Please enter the guest's last name"),
      email: z.string().nonempty("Please enter the guest's email"),
      mobile: z
        .string()
        .nonempty("Please enter the guest's mobile")
        .nullable()
        .optional(),
      countryOfResidence: z.string().nullable().optional(),
      ageGroup: z.nativeEnum(AgeGroup),
    })
  ),
  bookingReference: z.string().optional(),
  roomNumber: z.string(),
  dates: z
    .any()
    .optional()
    .refine(
      (dates) => dates?.start && dates?.end,
      "Please enter the guest's check-in date and check-out date"
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onClose: () => void;
  visible: boolean;
  onSuccess?: () => void;
}

export const BookingsAddModal: React.FC<Props> = ({ onClose, visible }) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      party: [{ id: v4(), ageGroup: AgeGroup.Adult }],
    },
    validationResolver,
    validationContext: formSchema,
  });

  const { register, unregister } = formMethods;

  useEffect(() => {
    register('party[0].id');
    register('party[0].ageGroup');
    register('party[0].mobile');
    register('party[0].address');

    return () => {
      unregister('party[0].id');
      unregister('party[0].ageGroup');
      unregister('party[0].mobile');
      unregister('party[0].address');
    };
  }, [register, unregister]);

  useEffect(() => {
    if (!visible) {
      setGuests([]);
    }
  }, [visible]);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSearchGuests = _.debounce(async (query) => {
    if (query.length <= 2) {
      setGuests([]);
      return;
    }

    try {
      const { searchGuests } = await sdk.searchGuests({
        query,
        limit: 4,
        anonGuests: false,
      });

      setGuests(searchGuests.data as Guest[]);
      // eslint-disable-next-line no-empty
    } catch {}
  }, 300);

  const handleAddVisit = async (formValues: FormValues) => {
    setSubmitLoading(true);

    const country = countryData.find(
      (c) => c.name === formValues.party[0].countryOfResidence
    );

    formValues.party[0].countryOfResidence = country?.countryCode;

    const payload = {
      ...formValues,
      checkInDate: dayjs(formValues?.dates?.start).format('YYYY-MM-DD'),
      checkOutDate: dayjs(formValues?.dates?.end).format('YYYY-MM-DD'),
    };

    delete (payload as Partial<typeof payload>)?.dates;

    const toastId = toast.loader('Creating booking');
    try {
      await sdk.createBooking(payload);
      toast.update(toastId, 'Booking created successfully');
      onClose();
    } catch (error) {
      toast.update(toastId, 'Unable to create booking');
    }

    setSubmitLoading(false);
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <Form.ModalWrapper key={visible ? 'visible' : 'hidden'}>
        <FormContext {...formMethods}>
          <Form.Provider onSubmit={formMethods.handleSubmit(handleAddVisit)}>
            <Text.Heading>Add a Booking</Text.Heading>
            <Text.Descriptor>
              Add a guest if they have a booking so they can have guest access
              on the app and do things like submit orders straight from the app.
            </Text.Descriptor>
            <Inputs.Search
              data={
                guests?.map((guest) => ({
                  title: `${guest.firstName} ${guest.lastName}`,
                  subheading: guest.email,
                  payload: guest,
                })) as SearchItem[]
              }
              onChange={(e) => {
                handleSearchGuests(e.currentTarget.value);
              }}
              onClick={(data) => {
                formMethods.setValue('party[0].email', data.subheading);
                formMethods.setValue(
                  'party[0].firstName',
                  data.payload.firstName
                );
                formMethods.setValue(
                  'party[0].lastName',
                  data.payload.lastName
                );
                formMethods.setValue(
                  'party[0].countryOfResidence',
                  countryData.find(
                    (c) => c.countryCode === data.payload.countryCode
                  )?.name
                );

                formMethods.setValue('party[0].mobile', data.payload.mobile);
              }}
              label="Email"
              note="The guest should use the app with this email"
              name="party[0].email"
              placeholder="a.wanderwall@email.com"
              autoComplete="none"
            />
            <Inputs.Text
              label="First Name"
              name="party[0].firstName"
              placeholder="Alex"
              autoComplete="none"
            />
            <Inputs.Text
              label="Last Name"
              name="party[0].lastName"
              placeholder="Wanderwall"
              autoComplete="none"
            />
            <CountryPicker
              label="Country of residence"
              name="party[0].countryOfResidence"
            />

            <Inputs.Text
              label="Booking Reference"
              name="bookingReference"
              placeholder="HM-001"
            />
            <Inputs.Text
              label="Room Number"
              name="roomNumber"
              placeholder="200"
            />
            <FormInputs.DateRange
              name="dates"
              label="Dates of stay"
              startPlaceholder="Check-in"
              endPlaceholder="Check-out"
            />
            <input style={{ display: 'none' }} autoComplete="on" />
            <Form.Submit loading={submitLoading} onCancel={onClose}>
              Add booking
            </Form.Submit>
          </Form.Provider>
        </FormContext>
      </Form.ModalWrapper>
    </Modal>
  );
};

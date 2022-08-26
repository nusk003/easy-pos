import { Hotel, User, UserRole } from '@hm/sdk';
import { Link, Tag, Text, toast } from '@src/components/atoms';
import { Inputs, Modal, Verify } from '@src/components/molecules';
import { SearchItem } from '@src/components/molecules/inputs/search.component';
import { Form } from '@src/components/templates/form';
import { theme } from '@src/components/theme';
import { validationResolver } from '@src/util/form';
import {
  getReadableUserRole,
  getUserRole,
  parseRole,
  ReadableRole,
} from '@src/util/users';
import { sdk } from '@src/xhr/graphql-request';
import { useUser, useUsers } from '@src/xhr/query';
import Fuse from 'fuse.js';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import * as z from 'zod';
import { ManageTeamUserTile } from './manage-team-user-tile.component';

const SSelectedHotelTilesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const SSelectedHotelTile = styled(Tag)`
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
  cursor: pointer;
`;

const SRadioWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 16px 80px;
  align-items: center;
`;

const SFormModalWrapper = styled(Form.ModalWrapper)`
  width: 700px;
`;

interface Props {
  onClose: () => void;
  defaultValues?: User;
  visible: boolean;
}

interface FormValues {
  email: string;
  role: ReadableRole;
}

export const ManageTeamAddUserModal: React.FC<Props> = ({
  onClose,
  defaultValues,
  visible,
}) => {
  const { data: user } = useUser();
  const { mutate: mutateUsers } = useUsers(false);

  const userHotels = user?.hotels || [];

  const formSchema = z.object({
    email: z
      .string()
      .nonempty('Please enter an email')
      .email('Please enter a valid email'),
    role: user?.hotelManager
      ? z.undefined()
      : z.string().nonempty('Please select a role'),
  });

  const { setValue, ...formMethods } = useForm<FormValues>({
    validationResolver,
    validationContext: formSchema,
  });

  const [state, setState] = useState({ isVerifyVisible: false });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedHotels, setSelectedHotels] = useState<Hotel[]>(
    defaultValues?.hotels || []
  );
  const [searchHotels, setSearchHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    if (visible) {
      setSelectedHotels(defaultValues?.hotels || []);
      setSearchHotels(
        userHotels.filter((hotel) => {
          return !defaultValues?.hotels.map((h) => h.id).includes(hotel.id);
        }) || []
      );

      setTimeout(() => {
        setValue('role', getReadableUserRole(defaultValues));
      });
    } else {
      setTimeout(() => {
        setState((s) => ({ ...s, isVerifyVisible: false }));
      }, 300);
    }
  }, [defaultValues, setValue, userHotels, visible]);

  const handleAddUser = async (formValues: FormValues) => {
    const { email, role } = formValues;

    if (
      (role === ReadableRole.HotelAdmin || role === ReadableRole.HotelMember) &&
      !selectedHotels.length
    ) {
      toast.warn('Please select a hotel');
      return;
    }

    setSubmitLoading(true);

    try {
      const groupAdmin = formValues.role === ReadableRole.GroupAdmin;

      const hotels = selectedHotels.map((h) => {
        return {
          id: h.id,
          role: parseRole(role as ReadableRole)!,
        };
      });

      if (defaultValues) {
        await sdk.updateUser({
          where: { id: defaultValues.id },
          data: {
            hotels: !groupAdmin ? hotels : null,
            groupAdmin,
          },
        });
        toast.info('Successfully updated user');
      } else {
        await sdk.inviteHotelUser({ email, hotels, groupAdmin });
        toast.info(`Successfully invited ${formValues.email}`);
      }

      await mutateUsers();
      setSubmitLoading(false);
      onClose();
    } catch {
      if (!defaultValues) {
        toast.warn('Unable to invite user');
      } else {
        toast.warn('Unable to update user');
      }
      setSubmitLoading(false);
    }
  };

  interface HotelSearchItem extends SearchItem {
    payload?: Hotel;
  }
  const handleSearchClick = (hotelSearchItem: HotelSearchItem) => {
    setSelectedHotels((hotels) => {
      const hotelIndex = userHotels.findIndex(
        (h) => h.id === hotelSearchItem.payload?.id
      );

      if (hotelIndex < -1) {
        return hotels;
      }

      return [...hotels, userHotels[hotelIndex]];
    });

    setSearchHotels((hotels) => {
      const hotelIndex = hotels.findIndex(
        (h) => h.id === hotelSearchItem.payload?.id
      );

      if (hotelIndex < -1) {
        return hotels;
      }

      hotels.splice(hotelIndex, 1);
      return [...hotels];
    });
  };

  const handleSearchChange = useCallback(
    _.debounce((value: string) => {
      if (!user) {
        return;
      }

      const availableHotels =
        userHotels.filter((hotel) => {
          return !selectedHotels.map((h) => h.id).includes(hotel.id);
        }) || [];

      if (!value) {
        setSearchHotels(availableHotels);
        return;
      }

      const fuse = new Fuse(availableHotels, { keys: ['name'] });
      const hotelSearch = fuse.search(value);
      setSearchHotels([...hotelSearch.map((search) => search.item)]);
    }, 100),
    [userHotels, searchHotels, user, selectedHotels]
  );

  const unselectHotel = (hotel: Hotel) => {
    setSearchHotels((hotels) => {
      const hotelIndex = userHotels.findIndex((h) => h.id === hotel.id);

      if (hotelIndex < -1) {
        return hotels;
      }

      return [...hotels, userHotels[hotelIndex]];
    });

    setSelectedHotels((hotels) => {
      const hotelIndex = hotels.findIndex((h) => h.id === hotel.id);

      if (hotelIndex < -1) {
        return hotels;
      }

      hotels.splice(hotelIndex, 1);
      return [...hotels];
    });
  };

  const handleDeleteUser = async () => {
    if (!defaultValues) {
      return;
    }

    try {
      await sdk.deleteUser({ where: { id: defaultValues.id } });
      toast.info(`Successfully deleted ${defaultValues?.email}`);
    } catch {
      toast.warn(`Unable to delete ${defaultValues?.email}`);
    }

    await mutateUsers();

    onClose();
  };

  const selectedRole = formMethods.watch('role') as ReadableRole;

  const adminUserRole = getUserRole(user);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Verify
        type="delete"
        title="Delete user"
        message={`Are you sure you want to delete ${defaultValues?.email}`}
        onVerify={handleDeleteUser}
        onClose={() => setState((s) => ({ ...s, isVerifyVisible: false }))}
        visible={state.isVerifyVisible}
        key={defaultValues?.id}
      >
        <SFormModalWrapper>
          <FormContext
            {...formMethods}
            setValue={setValue}
            key={String(visible)}
          >
            <Form.Provider onSubmit={formMethods.handleSubmit(handleAddUser)}>
              <Text.Heading>Invite a user</Text.Heading>
              <Text.Descriptor>
                Invite a user to give them access to their own Dashboard
              </Text.Descriptor>
              <Inputs.Text
                label="Email"
                note="An invite will be sent out to this email. The user will login with this email address."
                name="email"
                placeholder="a.wanderwall@email.com"
                defaultValue={defaultValues?.email.toLowerCase()}
                hidden={!!defaultValues}
              />
              {defaultValues ? (
                <>
                  <ManageTeamUserTile user={defaultValues} />

                  <Link
                    linkStyle="red"
                    onClick={() =>
                      setState((s) => ({ ...s, isVerifyVisible: true }))
                    }
                    disabled={submitLoading}
                    disableOnClick={false}
                  >
                    Delete user
                  </Link>
                </>
              ) : null}
              {!user?.hotelManager ? (
                <div>
                  <div>
                    <Text.Body mb="4px" fontWeight="medium">
                      Hotels
                    </Text.Body>
                    <Text.Descriptor>
                      {selectedRole !== 'Group Admin'
                        ? 'The user will have access to all of the hotels selected below'
                        : 'The user will have access to all of the hotels in the group'}
                    </Text.Descriptor>
                  </div>

                  <div>
                    {selectedRole !== 'Group Admin' && selectedHotels.length ? (
                      <SSelectedHotelTilesWrapper>
                        {selectedHotels.map((hotel) => (
                          <SSelectedHotelTile
                            key={hotel.id}
                            mr="small"
                            mt="small"
                            tagStyle="gray"
                            onClick={() => unselectHotel(hotel)}
                          >
                            {hotel.name}
                            <FaTimes />
                          </SSelectedHotelTile>
                        ))}
                      </SSelectedHotelTilesWrapper>
                    ) : null}

                    {selectedRole !== 'Group Admin' ? (
                      <Inputs.Search
                        name="hotels"
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onClick={handleSearchClick}
                        noRegister
                        placeholder="Search for hotels"
                        data={searchHotels?.map((hotel) => ({
                          title: hotel.name,
                          payload: hotel,
                        }))}
                      />
                    ) : null}
                  </div>

                  <Text.Body mt="16px" fontWeight="medium">
                    Roles
                  </Text.Body>

                  <SRadioWrapper>
                    {adminUserRole === UserRole.SuperAdmin ||
                    adminUserRole === UserRole.GroupAdmin ? (
                      <>
                        <Inputs.Radio
                          data={['Group Admin']}
                          name="role"
                          displayError={false}
                        />
                        <Text.Primary color={theme.textColors.lightGray}>
                          Best for group owners and company administrators. This
                          user will have access to all hotels in the group.
                        </Text.Primary>
                      </>
                    ) : null}

                    <Inputs.Radio
                      data={['Hotel Admin']}
                      name="role"
                      displayError={false}
                    />
                    <Text.Primary color={theme.textColors.lightGray}>
                      Best for hotel managers involved in the day to day
                      operation of the hotel
                    </Text.Primary>

                    <Inputs.Radio data={['Hotel Member']} name="role" />
                    <Text.Primary color={theme.textColors.lightGray}>
                      Best for employees who need regular access to Cloud
                      Console
                    </Text.Primary>
                  </SRadioWrapper>
                </div>
              ) : (
                <>
                  {!defaultValues ? (
                    <Text.Body fontWeight="medium" color="blue">
                      This user will have admin access for all hotels as they
                      are in the Hotel Manager group.
                    </Text.Body>
                  ) : null}
                </>
              )}
              {!user?.hotelManager || (user.hotelManager && !defaultValues) ? (
                <Form.Submit loading={submitLoading} onCancel={onClose}>
                  {defaultValues ? 'Update user' : 'Invite user'}
                </Form.Submit>
              ) : null}
            </Form.Provider>
          </FormContext>
        </SFormModalWrapper>
      </Verify>
    </Modal>
  );
};

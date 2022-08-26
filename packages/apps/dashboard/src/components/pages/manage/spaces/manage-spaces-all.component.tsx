import { CreateSpaceMutationVariables, Space } from '@hm/sdk';
import { Button, Link, Text, toast, Tooltip } from '@src/components/atoms';
import { Table, ToggleDropdown, Verify } from '@src/components/molecules';
import { ManageSpacesDuplicateModal } from '@src/components/organisms';
import { Header } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { getAvailabilityText } from '@src/util/spaces';
import { sdk } from '@src/xhr/graphql-request';
import { useSpaces } from '@src/xhr/query';
import React, { useMemo, useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import { useHistory } from 'react-router';
import styled from 'styled-components';

const SWrapper = styled.div`
  min-height: calc(100vh - 141px);
  background-color: #fafafa;
  margin-right: -16px;

  background: #fafafa;
  padding: 32px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
    min-height: calc(100vh - 101px);
  }
`;

const SToggleDropdownWrapper = styled.div`
  display: grid;
  justify-content: center;
`;

export const ManageSpacesAll: React.FC = () => {
  const history = useHistory();

  const { data: spaces, mutate: mutateSpaces } = useSpaces();

  const [isDuplicateVerifyVisible, setIsDuplicateVerifyVisible] =
    useState(false);
  const [isDeleteVerifyVisible, setIsDeleteVerifyVisible] = useState(false);

  const [selectedSpaces, setSelectedSpaces] = useState<Record<string, boolean>>(
    {}
  );

  const isAllSpacesSelected = useMemo(() => {
    if (!spaces || !spaces.length) {
      return false;
    }

    return !spaces.some((space) => !selectedSpaces[space.id]);
  }, [selectedSpaces, spaces]);

  const toggleAllSpaces = () => {
    if (!spaces) {
      return;
    }

    const newSelectedSpaces: typeof selectedSpaces = {};

    spaces.forEach(({ id }) => {
      newSelectedSpaces[id] = !isAllSpacesSelected;
    });

    setSelectedSpaces(newSelectedSpaces);
  };

  const toggleSpace = (id: string) => {
    setSelectedSpaces((s) => {
      s[id] = s[id] === undefined ? true : !s[id];
      return { ...s };
    });
  };

  const handleDeleteSpaces = () => {
    if (!spaces || !spaces.length) {
      return false;
    }

    if (!spaces.find((space) => selectedSpaces[space.id])) {
      toast.warn('Please select at least 1 space to delete');
      return;
    }

    setIsDeleteVerifyVisible(true);
  };

  const deleteSpaces = async () => {
    const selectedSpaceIds = Object.entries(selectedSpaces)
      .filter(([_spaceId, selected]) => selected)
      .map(([spaceId, _selected]) => ({ id: spaceId }));

    setSelectedSpaces((s) => {
      selectedSpaceIds.forEach(({ id }) => {
        delete s[id];
      });

      return { ...s };
    });

    const toastId = toast.loader('Deleting spaces');

    try {
      await sdk.deleteSpaces({
        where: selectedSpaceIds,
      });
      await mutateSpaces();
      setIsDeleteVerifyVisible(false);
      toast.update(toastId, 'Successfully deleted spaces');
    } catch {
      toast.update(toastId, 'Unable to delete spaces');
    }
  };

  const handleDuplicateSpaces = () => {
    if (!spaces || !spaces.length) {
      return false;
    }

    if (spaces.filter((space) => selectedSpaces[space.id]).length !== 1) {
      toast.warn('Please select 1 space to duplicate');
      return;
    }

    setIsDuplicateVerifyVisible(true);
  };

  const duplicateSpace = async (name: string) => {
    const selectedSpaceId = Object.entries(selectedSpaces).find(
      ([_spaceId, selected]) => selected
    )?.[0];

    if (!selectedSpaceId) {
      return;
    }

    const space: Partial<Space> = {
      ...spaces!.find((p) => p.id === selectedSpaceId),
    };

    const toastId = toast.loader(`Duplicating ${space.name} as ${name}`);

    try {
      await sdk.createSpace({
        ...space,
        name,
        enabled: false,
      } as CreateSpaceMutationVariables);
      await mutateSpaces();
      setIsDuplicateVerifyVisible(false);
      toast.update(toastId, `Successfully duplicated ${space.name}`);
    } catch {
      toast.update(toastId, `Unable to duplicate ${space.name}`);
    }
  };

  const handleToggleEnabled = async (space: Space, value: boolean) => {
    try {
      await sdk.updateSpace({
        where: { id: space.id },
        data: { enabled: value },
      });
      await mutateSpaces();
      toast.info(
        `Successfully ${value ? 'enabled' : 'disabled'} ${space.name}`
      );
    } catch {
      toast.info(`Unable to ${value ? 'enable' : 'disable'} ${space.name}`);
    }
  };

  if (!spaces) {
    return null;
  }

  return (
    <>
      <Header
        title="Spaces"
        backgroundColor="#fafafa"
        primaryButton={
          <Button
            buttonStyle="primary"
            leftIcon={<FaLocationArrow size={10} />}
            onClick={() => history.push('/manage/spaces/space')}
          >
            Add Space
          </Button>
        }
      />

      <SWrapper>
        {!spaces?.length ? (
          <>
            <Text.Primary fontWeight="semibold" mb="4px">
              What are spaces?
            </Text.Primary>
            <Text.Body mb="16px">
              A space is an area in your hotel that guests can access via your
              app (e.g. restaurant, spa, gym).
            </Text.Body>
          </>
        ) : null}
        <Table.Provider>
          {spaces?.length ? (
            <Table.Header gridGap="16px">
              <Table.Checkbox
                selected={isAllSpacesSelected}
                onClick={() => toggleAllSpaces()}
                noWrapper
              />

              <Button
                ml="16px"
                buttonStyle="secondary"
                onClick={handleDuplicateSpaces}
              >
                Duplicate
              </Button>

              <Verify
                visible={isDeleteVerifyVisible}
                modal
                type="delete"
                title="Delete Spaces"
                message="Are you sure you want to delete these spaces?"
                onVerify={deleteSpaces}
                onClose={() => setIsDeleteVerifyVisible(false)}
              >
                <Button buttonStyle="delete" onClick={handleDeleteSpaces}>
                  Delete
                </Button>
              </Verify>
            </Table.Header>
          ) : null}
          <Table.Body>
            {spaces?.length ? (
              spaces?.map((space) => {
                return (
                  <Table.Row key={space.id}>
                    <Table.Checkbox
                      selected={selectedSpaces[space.id]}
                      onClick={() => toggleSpace(space.id)}
                    />
                    <Table.Cell>
                      <Text.Primary fontWeight="semibold">
                        {space.name}
                      </Text.Primary>
                      <Text.Body mt="2px">{space.location}</Text.Body>
                    </Table.Cell>
                    <Table.Cell>
                      <Text.Body color={theme.textColors.lightGray}>
                        {space.pricelists?.length > 0
                          ? space.pricelists?.length
                          : 'No'}{' '}
                        pricelist
                        {space.pricelists?.length !== 1 ? 's' : ''}
                      </Text.Body>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        message={getAvailabilityText(space.availability)}
                      >
                        <Text.Body
                          fontWeight="semibold"
                          color={theme.textColors.lightGray}
                        >
                          Opening times
                        </Text.Body>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <SToggleDropdownWrapper>
                        <ToggleDropdown
                          enabled={!!space.enabled}
                          onToggle={(value) =>
                            handleToggleEnabled(space, value)
                          }
                        />
                      </SToggleDropdownWrapper>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        buttonStyle="secondary"
                        float="right"
                        onClick={() =>
                          history.push('/manage/spaces/space', { space })
                        }
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={10} noBorder>
                  <Text.Body fontWeight="semibold">
                    You haven&apos;t set up any spaces yet
                  </Text.Body>

                  <Link
                    onClick={() => {
                      history.push('/manage/spaces/space');
                    }}
                    mt="4px"
                    disableOnClick={false}
                  >
                    Add a space +
                  </Link>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Provider>
      </SWrapper>

      <ManageSpacesDuplicateModal
        onClose={() => setIsDuplicateVerifyVisible(false)}
        visible={isDuplicateVerifyVisible}
        onSubmit={duplicateSpace}
      />
    </>
  );
};

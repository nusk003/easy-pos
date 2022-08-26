import { Pricelist, PricelistDeliveryType } from '@hm/sdk';
import { Tag, toast, Tooltip } from '@src/components/atoms';
import { DropdownMenu, Inputs } from '@src/components/molecules';
import { PricelistStatus, usePricelistStatus } from '@src/util/spaces';
import { sdk } from '@src/xhr/graphql-request';
import { useSpaces } from '@src/xhr/query';
import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

interface Props {
  pricelist: Pricelist;
}

const SMenuWrapper = styled(DropdownMenu.MenuWrapper)`
  padding: 8px;
`;

export const PricelistToggle: React.FC<Props> = ({ pricelist }) => {
  const { mutate: mutateSpaces } = useSpaces(false);

  const tagRef = useRef<HTMLDivElement>(null);

  const pricelistStatus = usePricelistStatus(pricelist.id);

  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const tableService = useMemo(
    () =>
      pricelist.delivery?.some(
        (d) => d.type === PricelistDeliveryType.Table && d.enabled
      ),
    [pricelist.delivery]
  );

  const roomService = useMemo(
    () =>
      pricelist.delivery?.some(
        (d) => d.type === PricelistDeliveryType.Room && d.enabled
      ),
    [pricelist.delivery]
  );

  const handleToggleDeliveryType = async (
    type: PricelistDeliveryType,
    enabled: boolean
  ) => {
    const delivery = pricelist.delivery || [];

    const deliveryType = delivery.find((d) => d.type === type);

    if (deliveryType) {
      deliveryType.enabled = enabled;
    } else {
      delivery.push({
        type,
        enabled,
      });
    }

    const toastId = toast.loader(
      `${enabled ? 'Enabling' : 'Disabling'} ${
        type === PricelistDeliveryType.Room ? 'room service' : 'table service'
      }`
    );
    setLoading(true);

    try {
      await mutateSpaces((spaces) => {
        if (!spaces) {
          return spaces;
        }

        const spaceIndex = spaces.findIndex((s) =>
          s.pricelists.find((p) => p.id === pricelist.id)
        );

        if (spaceIndex <= -1) {
          return spaces;
        }

        const pricelistIndex = spaces[spaceIndex].pricelists.findIndex(
          (p) => p.id === pricelist.id
        );

        if (pricelistIndex <= -1) {
          return spaces;
        }

        spaces[spaceIndex].pricelists[pricelistIndex].delivery = [...delivery];

        return [...spaces];
      }, false);

      await sdk.updatePricelist({
        where: {
          id: pricelist.id,
        },
        data: {
          delivery,
        },
      });

      await mutateSpaces();

      toast.update(
        toastId,
        `Successfully ${enabled ? 'enabled' : 'disabled'} ${
          type === PricelistDeliveryType.Room ? 'room service' : 'table service'
        }`
      );
    } catch {
      await mutateSpaces();
      toast.update(toastId, 'Unable to toggle pricelist delivery type');
    }

    setLoading(false);
  };

  return (
    <div>
      <Tooltip
        message={
          pricelistStatus === PricelistStatus.SpaceDisabled
            ? `"${pricelist.space?.name}" is disabled`
            : pricelistStatus === PricelistStatus.Hidden
            ? `"${pricelist.name}" has no items`
            : pricelistStatus === PricelistStatus.Disabled
            ? `"${pricelist.name}" has no enabled fulfilment options`
            : pricelistStatus === PricelistStatus.CommerceDisabled
            ? `"${pricelist.name}" has commerce disabled. The pricelist is still visible but cannot accept orders.`
            : ''
        }
      >
        <div ref={tagRef}>
          <Tag
            tagStyle={
              pricelistStatus === PricelistStatus.Live
                ? 'blue'
                : pricelistStatus === PricelistStatus.Disabled ||
                  pricelistStatus === PricelistStatus.SpaceDisabled
                ? 'red'
                : 'blue-border'
            }
            onClick={
              pricelist.commerce
                ? () => {
                    setIsDropdownVisible(true);
                  }
                : undefined
            }
          >
            {pricelistStatus}
          </Tag>
        </div>
      </Tooltip>
      <SMenuWrapper
        buttonRef={tagRef}
        onClose={() => setIsDropdownVisible(false)}
        visible={isDropdownVisible}
      >
        <Inputs.Checkbox
          name="roomService"
          noRegister
          value={roomService}
          onClick={(value) =>
            handleToggleDeliveryType(PricelistDeliveryType.Room, value)
          }
          toggle
          boldSideLabel
          sideLabel="Room Service"
          disabled={loading}
        />
        <Inputs.Checkbox
          name="tableService"
          noRegister
          value={tableService}
          onClick={(value) =>
            handleToggleDeliveryType(PricelistDeliveryType.Table, value)
          }
          toggle
          boldSideLabel
          sideLabel="Table Service"
          disabled={loading}
        />
      </SMenuWrapper>
    </div>
  );
};

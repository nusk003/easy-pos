import { Link, Text } from '@src/components/atoms';
import { Inputs } from '@src/components/molecules';
import { theme } from '@src/components/theme';
import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';
import styled from 'styled-components';
import { BiLink } from 'react-icons/bi';

const SInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: auto minmax(auto, 500px) auto 0 auto;
  justify-content: left;
  align-items: center;
`;

const SLinkButton = styled(BiLink)`
  fill: ${theme.colors.blue};
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  padding-top: 4px;
  margin-left: 8px;
`;

const SDeleteButton = styled(AiFillDelete)`
  fill: ${theme.textColors.blue};
  cursor: pointer;
  user-select: none;
  padding-top: 4px;
  margin-left: 8px;
`;

const SPopupWrapper = styled.div<{ visible: boolean }>`
  position: relative;
  bottom: 48px;
  left: -152px;
  padding: 8px;
  box-shadow: 0px 4px 16px rgba(18, 45, 115, 0.1);
  background: ${theme.colors.white};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  width: fit-content;
`;

interface Props {
  name: string;
}

export const ManageBookingsCheckInTermsFields: React.FC<Props> = ({ name }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const [visiblePopups, setVisiblePopups] = useState<Record<number, boolean>>(
    {}
  );

  return (
    <>
      {fields.map((item, idx) => {
        const field = `${name}[${idx}]`;
        return (
          <SInputsWrapper key={item.id}>
            <Text.Body mr="8px">I agree to</Text.Body>
            <Inputs.Text
              placeholder="Enter your term"
              name={`${field}.message`}
            />
            <SLinkButton
              onClick={() =>
                setVisiblePopups((s) => ({ ...s, [idx]: !s[idx] }))
              }
            />
            <SPopupWrapper visible={visiblePopups[idx]}>
              <Inputs.Text
                name={`${field}.link`}
                placeholder="https://www.hotel.com/terms"
                width="250px"
                sideLabel={
                  <Link
                    fontSize={14}
                    disableOnClick={false}
                    onClick={() =>
                      setVisiblePopups((s) => ({ ...s, [idx]: !s[idx] }))
                    }
                  >
                    +
                  </Link>
                }
              />
            </SPopupWrapper>
            <SDeleteButton onClick={() => remove(idx)} />
          </SInputsWrapper>
        );
      })}
      <Link
        disableOnClick={false}
        onClick={() => append({ value: '', link: '' })}
        mt={16}
      >
        + Add an agreement checkbox
      </Link>
    </>
  );
};

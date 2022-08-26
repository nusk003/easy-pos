import { Text, Tooltip } from '@src/components/atoms';
import { Header } from '@src/components/templates';
import { theme } from '@src/components/theme';
import { useHotel } from '@src/xhr/query';
import { toDataURL as QRToDataURL } from 'qrcode';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const SWrapper = styled.div`
  height: calc(100vh - 141px);
  margin-right: -16px;

  display: grid;
  align-content: start;

  background: #fafafa;
  padding: 32px;

  ${theme.mediaQueries.tablet} {
    padding: 16px;
  }
`;

const SQRCode = styled.img`
  margin-top: 16px;
`;

const SLink = styled.a`
  margin-top: 8px;
  text-decoration: none;
  color: ${(props) => props.theme.textColors.blue};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  width: max-content;
`;

export const ManageAppQRCode = () => {
  const { data: hotel } = useHotel();

  const [qrCode, setQRCode] = useState<string>();

  const appUrl = useMemo(() => {
    if (process.env.REACT_APP_STAGE === 'production') {
      return `https://guest.hotelmanager.co/${hotel?.id}`;
    }

    return `https://stg.guest.hotelmanager.co/${hotel?.id}`;
  }, [hotel?.id]);

  const generateQR = useCallback(async () => {
    if (!appUrl) {
      return;
    }

    try {
      const dataURL = await QRToDataURL(appUrl, { margin: 0 });
      setQRCode(dataURL);
    } catch {
      return;
    }
  }, [appUrl]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  return (
    <>
      <Header backgroundColor="#fafafa" title="QR Code" />
      <SWrapper>
        <Text.Primary fontWeight="semibold">QR Code</Text.Primary>
        <Text.Descriptor mt="8px">
          Use this for your branding. We recommend adding this in guest&apos;s
          rooms, on restaurant tables and in common areas.
        </Text.Descriptor>
        <Tooltip message="Click to download">
          <a
            href={qrCode}
            download={`${hotel?.name
              .toLowerCase()
              .replaceAll(' ', '-')}-app-qr-code`}
          >
            <SQRCode src={qrCode} alt="" />
          </a>
        </Tooltip>
        <SLink href={appUrl} target="_blank">
          {appUrl}
        </SLink>
      </SWrapper>
    </>
  );
};

import { Modal } from '@src/components/molecules';
import { useHotel } from '@src/xhr/query';
import React, { useMemo } from 'react';

const emailHTML = `
<html>
  <head>
    <title></title>
    <style>
      p {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        line-height: 21px;
      }

      @media screen and (min-width: 768px) {
        .wrapper {
          width: 768px;
          margin: 0 auto;
        }
      }
    </style>
  </head>
  <body
    style="
      background-color: #f4f4f4;
      margin: 0;
      color: #000000;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
        Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    "
  >
    <div style="background-color: #fff;" class="wrapper">
      <div
        style="
          padding: 0 20px;
          padding-top: 40px;
          font-weight: 600;
          font-size: 25px;
        "
      >
        Your reservation at {{hotelName}}
      </div>

      <div style="padding: 0 20px; padding-top: 40px;">
        <p>
          Dear {{firstName}} {{lastName}},<br /><br />
          Online check-in is now available for your reservation.
        </p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
        <p style="font-weight: 700;">Details</p>
        <div style="padding-top: 20px;">
          <p style="font-weight: 700; color: rgba(0, 0, 0, 0.5);">Guest</p>
          <p>Alex Wanderwall</p>
        </div>
        <div style="padding-top: 20px;">
          <p style="font-weight: 700; color: rgba(0, 0, 0, 0.5);">Date</p>
          <p>{{checkInDate}} — {{checkOutDate}}</p>
        </div>
      </div>

      <div style="padding: 0 20px; padding-top: 20px;">
        <p>We look forward to welcoming you!</p>
      </div>

      <div style="padding: 0 20px; padding-top: 40px; padding-bottom: 20px;">
        <a
          style="
            display: block;
            padding: 12px 0;
            background: #000000;
            border-radius: 12px;
            color: #fff;
            cursor: pointer;
            border-style: unset;
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
              Helvetica, Arial, sans-serif, 'Apple Color Emoji',
              'Segoe UI Emoji';
            font-weight: bold;
            font-size: 20px;
            line-height: 24px;
            text-align: center;
            text-decoration: none;
            user-select: none;
          "
        >
          Check in now
        </a>
      </div>
    </div>
  </body>
</html>  
`;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const BookingEmailTemplate: React.FC<Props> = ({ visible, onClose }) => {
  const { data: hotel } = useHotel();

  const html = useMemo(() => {
    return emailHTML
      .replace(/{{hotelName}}/g, hotel?.name || '')
      .replace(/{{firstName}}/g, 'Alex')
      .replace(/{{lastName}}/g, 'Wanderwall')
      .replace(/{{checkInDate}}/g, 'Thu 7th Aug')
      .replace(/{{checkOutDate}}/g, 'Sat 9th Aug');
  }, [hotel]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Modal>
  );
};

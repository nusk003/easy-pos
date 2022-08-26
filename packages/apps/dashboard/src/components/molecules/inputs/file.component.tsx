import { Text, Tooltip } from '@src/components/atoms';
import { Modal } from '@src/components/molecules/modal';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IoMdExpand } from 'react-icons/io';
import styled from 'styled-components';
import { ErrorText } from './text.component';
import Compressor from 'compressorjs';

const SInput = styled.input`
  display: none;
`;

const SWrapper = styled.div`
  display: grid;
  grid-gap: 16px;
`;

const SImageHolder = styled.label`
  width: min-content;
`;

const SImage = styled.img`
  align-content: center;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  cursor: pointer;
  background: #d4d4d4;
  object-fit: contain;
`;

const SPlaceholderImage = styled.div`
  align-content: center;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  cursor: pointer;
  background: #d4d4d4;
  object-fit: contain;
`;

const SLabelWrapper = styled.div`
  display: grid;
  grid-gap: 4px;
`;

const SImageContainer = styled.div`
  position: relative;
  width: max-content;
`;

const SFullViewIcon = styled(IoMdExpand)`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 2;
  cursor: pointer;
  background: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.textColors.lightGray};
  border-radius: 8px;
  padding: 2px;
  box-shadow: 0px 4px 16px rgba(100, 100, 100, 0.4);
`;

const SExpandedImg = styled.img`
  background: #d4d4d4;
  max-width: 80vw;
`;

interface Props
  extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string;
  defaultValue?: string;
  label?: string;
  note?: string;
  onChange: (file: File, setImage: () => void) => void;
  compressImage?: boolean;
  acceptOnlyImages?: boolean;
}

export const FileComponent: React.FC<Props> = ({
  name,
  defaultValue,
  label,
  note,
  onChange,
  compressImage,
  acceptOnlyImages,
  ...rest
}) => {
  const formContext = useFormContext();

  const imageRef = useRef<HTMLImageElement>(null);

  const [fileURL, setFileURL] = useState(defaultValue);
  const [showModal, setShowModal] = useState(false);

  const getFile = (rawFile: File) => {
    return new File([rawFile], name, {
      type: rawFile.type,
      lastModified: rawFile.lastModified,
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const rawFile = e.target.files[0] as File;

    if (compressImage && acceptOnlyImages) {
      new Compressor(rawFile, {
        quality: 0.6,
        convertSize: 100000,
        success: (compressedRawFile) => {
          const compressedFile = getFile(compressedRawFile as File);
          onChange(compressedFile, () => {
            setFileURL(URL.createObjectURL(compressedFile));
          });
        },
      });
    } else {
      const file = getFile(rawFile);
      onChange(getFile(file), () => {
        setFileURL(URL.createObjectURL(file));
      });
    }
  };

  useEffect(() => {
    setFileURL(defaultValue);
  }, [defaultValue]);

  return (
    <SWrapper>
      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <SExpandedImg src={fileURL} />
      </Modal>

      <SLabelWrapper>
        {label ? <Text.Body fontWeight="medium">{label}</Text.Body> : null}
        {note ? <Text.Descriptor>{note}</Text.Descriptor> : null}
      </SLabelWrapper>
      <Tooltip message="Upload new image">
        <SImageContainer>
          {fileURL ? (
            <SFullViewIcon size={14} onClick={() => setShowModal(true)} />
          ) : null}
          <SImageHolder>
            {fileURL ? (
              <SImage
                ref={imageRef}
                src={fileURL}
                alt=""
                onError={() => {
                  setFileURL(undefined);
                }}
              />
            ) : (
              <SPlaceholderImage />
            )}
            <SInput
              {...(acceptOnlyImages && { ...{ accept: 'image/*' } })}
              id={`${name}-input-image`}
              name={name}
              type="file"
              onChange={handleUpload}
              {...rest}
            />
            {formContext?.errors[name]?.message ? (
              <ErrorText>{formContext?.errors[name]?.message}</ErrorText>
            ) : null}
          </SImageHolder>
        </SImageContainer>
      </Tooltip>
    </SWrapper>
  );
};

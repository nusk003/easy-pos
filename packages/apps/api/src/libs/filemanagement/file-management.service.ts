import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { __prod__, __stg__ } from '@src/constants';
import { Context, GuestSession, UserSession } from '@src/utils/context';
import { InternalError } from '@src/utils/errors';
import { S3 } from 'aws-sdk';
import { AssetType } from './file-management.types';

@Injectable()
export class FileManagementService {
  constructor(@Inject(CONTEXT) private context: Context) {}

  get session() {
    return <GuestSession | UserSession>this.context.req.user;
  }

  get S3AssetBucket() {
    return 'hm-hotel-assets';
  }

  async uploadAsset(
    assetType: AssetType,
    data: S3.Body,
    filename: string,
    previousKey?: string | undefined,
    s3Options?: Partial<S3.PutObjectRequest>
  ) {
    const s3 = new S3({ apiVersion: '2006-03-01' });

    let filePathBase: string;

    if (__prod__) {
      filePathBase = `prd/${this.session.hotel}`;
    } else if (__stg__) {
      filePathBase = `stg/${this.session.hotel}`;
    } else {
      filePathBase = `dev/${this.session.hotel}`;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const fileNameTimestamp = `${filename}-${timestamp}`;

    const fileNameExtension = 'png';

    const key = `${filePathBase}/${assetType}/${fileNameTimestamp}.${fileNameExtension}`;

    if (previousKey?.includes('amazonaws.com')) {
      await this.deleteAsset(previousKey);
    }

    const response = await s3
      .upload({
        Bucket: this.S3AssetBucket,
        Key: key,
        Body: data,
        ...s3Options,
      })
      .promise();

    return response.Location;
  }

  async deleteAsset(filePath: string) {
    const s3 = new S3({ apiVersion: '2006-03-01' });

    const deleteParams = {
      Bucket: this.S3AssetBucket,
      Key: filePath.split('amazonaws.com/')[1],
    };

    try {
      await s3.deleteObject(deleteParams).promise();
    } catch (err) {
      console.error(err);
    }
  }
}

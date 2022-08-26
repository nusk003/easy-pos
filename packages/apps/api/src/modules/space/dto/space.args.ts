import { ArgsType, InputType } from '@nestjs/graphql';
import { Space } from '@src/modules/space/space.entity';
import {
  CreateArgsType,
  CreateDeleteArgsType,
  CreateDeleteManyArgsType,
  CreateUpdateArgsType,
  CreateUpdateInputType,
  CreateWhereArgsType,
  CreateWhereInputType,
} from '@src/utils/dto';

const argFields = <const>['name', 'location', 'availability', 'enabled'];

const updateArgFields = <const>['name', 'location', 'availability', 'enabled'];

@ArgsType()
export class CreateSpaceArgs extends CreateArgsType(Space, argFields) {}

@InputType()
class SpaceWhereInput extends CreateWhereInputType() {}

@InputType()
class UpdateSpaceInput extends CreateUpdateInputType(Space, updateArgFields) {}

@ArgsType()
export class UpdateSpaceArgs extends CreateUpdateArgsType(
  SpaceWhereInput,
  UpdateSpaceInput
) {}

@ArgsType()
export class DeleteSpaceArgs extends CreateDeleteArgsType() {}

@ArgsType()
export class WhereSpaceArgs extends CreateWhereArgsType() {}

@ArgsType()
export class DeleteSpacesArgs extends CreateDeleteManyArgsType() {}

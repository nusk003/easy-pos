import { Populate } from '@mikro-orm/core/typings';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Scope } from '@nestjs/common';
import { Role } from '@src/modules/role/role.entity';
import { NotFoundError } from '@src/utils/errors';
import { BaseService } from '@src/utils/service';
import { User } from './user.entity';

interface UserFindOneOptions<P extends string> {
  populate?: Populate<User, P>;
}

type CheckUserExistsOptions =
  | { id?: never; email: string }
  | { id: string; email?: never };

@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    readonly userRepository: EntityRepository<User>,
    @InjectRepository(Role)
    readonly rolesRepository: EntityRepository<Role>
  ) {
    super(userRepository);
  }

  async findAll() {
    const users = await this.userRepository.findAll({
      populate: ['roles', 'hotels', 'roles.hotel'],
    });
    return users as User[];
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id, { cache: 1000 });

    if (!user) {
      throw new NotFoundError(User, { id });
    }

    return user;
  }

  async findOneByEmail<P extends string>(
    email: string,
    opts?: UserFindOneOptions<P>
  ) {
    const user = await this.userRepository.findOne(
      { email },
      { populate: opts?.populate }
    );

    if (!user) {
      throw new NotFoundError(User, { email });
    }

    return user;
  }

  async checkUserExists(opts?: CheckUserExistsOptions): Promise<boolean> {
    const query = opts?.id ? opts.id : { email: opts!.email };
    const user = await this.userRepository.count(query);
    return user > 0;
  }

  async delete(user: User) {
    await user.roles.init();
    this.repository.remove(user);
  }

  async deleteRole(role: Role) {
    this.rolesRepository.remove(role);
  }

  async deleteRolesbyUserID(id: string) {
    const roles = await this.rolesRepository.find({ user: id });

    roles.forEach((role) => {
      this.rolesRepository.remove(role);
    });
  }
}

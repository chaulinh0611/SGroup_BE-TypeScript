import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from './BaseEntity.entity';
import { Permission } from './Permission.entity';
import { User } from './User.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 100 })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @ManyToMany(() => User, (user) => user.role)
  public users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  public permissions: Permission[];
}

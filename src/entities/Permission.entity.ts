import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Role } from './Role.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 100 })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  public roles: Role[];
}

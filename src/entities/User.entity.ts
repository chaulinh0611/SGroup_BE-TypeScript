import {Entity, Column, OneToMany} from "typeorm";
import {BaseEntity} from "./BaseEntity.entity"
import {Workspace} from "./Workspace.entity"
import {Notification} from "./Notification.entity"

@Entity('users')
export class User extends BaseEntity{
    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    avaUrl: string;

    @Column({nullable: true})
    token: string;

    @Column({nullable: true, name: 'refresh_token'})
    refreshToken: string;

    @Column({default: true})
    isActive: boolean;

    @OneToMany(() => Workspace, (workspace) => workspace.owner)
    workspaces: Workspace[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
}
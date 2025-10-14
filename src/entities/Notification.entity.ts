import {Entity, Column, ManyToOne} from "typeorm"
import { BaseEntity } from "./BaseEntity.entity"
import {User} from "./User.entity"

@Entity('notifications')
export class Notification extends BaseEntity{
    @Column()
    content: string;

    @Column({default: false})
    isRead: boolean;

    @ManyToOne(() => User, (user) => user.notifications)
    user: User;
}
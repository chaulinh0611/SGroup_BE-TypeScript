import {Entity, Column, ManyToOne, OneToMany} from "typeorm"
import { BaseEntity } from "./BaseEntity.entity"
import {Card} from "./Card.entity"

@Entity('comments')
export class Comment extends BaseEntity{
    @Column()
   content: string;

   @ManyToOne(() => Card, (card) => card.comments)
   card: Card;

   @ManyToOne(() => Comment, (comment) => comment.children, {nullable: true})
   parent: Comment;

   @OneToMany(() => Comment, (comment) => comment.parent)
   children: Comment[];

}
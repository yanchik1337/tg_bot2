import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { User } from "./User.js";

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  telegramFileId!: string;

  @Column({ nullable: true })
  googleDriveFileId?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ default: "downloading" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
  @ManyToOne(() => User, (user) => user.videos)
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;
}

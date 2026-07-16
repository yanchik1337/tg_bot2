import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Video } from "./Video.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bigint", unique: true })
  telegramId!: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  googleAccountEmail?: string;

  @Column({ nullable: true })
  googleDriveFolderId?: string;

  @Column({ nullable: true })
  googleDriveFolderName?: string;

  @Column({ nullable: true })
  googleAuthToken?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Video, (video) => video.user)
  videos!: Video[];
}

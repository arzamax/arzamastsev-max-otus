import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  public email!: string;

  @Prop({ required: true })
  public password!: string;

  @Prop({ required: true })
  public firstName!: string;

  @Prop({ required: true })
  public lastName!: string;

  @Prop({ default: false })
  public isBlocked!: boolean;

  @Prop({ default: false })
  public isInvalidated!: boolean;

  @Prop({ default: null })
  public validatedAt!: Date;

  @Prop({ default: false })
  public isVerifiedEmail!: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

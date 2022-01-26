import bcrypt from 'bcrypt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserDocument, UserSchema } from './schemas';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<UserDocument>('save', async function (next) {
            if (!this.isModified('password')) return next();

            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [],
  exports: [MongooseModule],
})
export class UserModule {}

import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString } from 'class-validator'

@InputType('LoginInput')
export class LoginDto {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  password: string
}

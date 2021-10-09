import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { IsValidPassword } from '@common/validators'

@InputType('SignUpInput')
export class SignUpDto {
  @Field()
  @IsString()
  @MinLength(3)
  name: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsValidPassword()
  password: string
}

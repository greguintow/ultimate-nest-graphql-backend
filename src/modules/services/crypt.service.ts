import { Injectable } from '@nestjs/common'
import { compare, hash, genSalt } from 'bcryptjs'

@Injectable()
export class CryptService {
  async encrypt(value: string): Promise<string> {
    const salt = await genSalt(5)
    return hash(value, salt)
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue)
  }
}

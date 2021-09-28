import { PrismaService } from '../prisma.service'

describe('PrismaService', () => {
  const prismaService = new PrismaService()

  describe('onModuleInit', () => {
    it('should run connect and log', async () => {
      jest.spyOn(prismaService, '$connect').mockImplementationOnce(async () => {})
      jest.spyOn(console, 'log').mockImplementationOnce(() => {})
      await prismaService.onModuleInit()
      expect(prismaService.$connect).toBeCalled()
      expect(console.log).toBeCalled()
    })
  })
  describe('onModuleDestroy', () => {
    it('should run disconnect', async () => {
      jest.spyOn(prismaService, '$disconnect').mockImplementationOnce(async () => {})
      await prismaService.onModuleDestroy()
      expect(prismaService.$disconnect).toBeCalled()
    })
  })
})

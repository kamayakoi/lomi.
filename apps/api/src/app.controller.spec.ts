import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiKeyGuard } from './core/common/guards/api-key.guard';
import { SupabaseService } from './utils/supabase/supabase.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
        {
          provide: ApiKeyGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: SupabaseService,
          useValue: {
            rpc: jest.fn(),
            getClient: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

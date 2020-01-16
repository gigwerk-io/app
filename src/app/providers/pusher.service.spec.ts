import { TestBed } from '@angular/core/testing';

import { PusherServiceProvider } from './pusher.service';

describe('PusherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PusherServiceProvider = TestBed.get(PusherServiceProvider);
    expect(service).toBeTruthy();
  });
});

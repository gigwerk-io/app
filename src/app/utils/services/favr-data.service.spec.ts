import { TestBed } from '@angular/core/testing';

import { FavrDataService } from './favr-data.service';

describe('FavrDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavrDataService = TestBed.get(FavrDataService);
    expect(service).toBeTruthy();
  });
});

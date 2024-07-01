import { TestBed } from '@angular/core/testing';

import { GetsService } from './gets.service';

describe('GetsService', () => {
  let service: GetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

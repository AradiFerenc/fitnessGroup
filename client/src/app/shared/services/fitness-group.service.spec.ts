import { TestBed } from '@angular/core/testing';

import { FitnessGroupService } from './fitness-group.service';

describe('FitnessGroupService', () => {
  let service: FitnessGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitnessGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

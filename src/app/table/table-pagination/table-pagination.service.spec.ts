import { TestBed } from '@angular/core/testing';

import { TablePaginationService } from './table-pagination.service';

describe('TablePaginationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TablePaginationService = TestBed.get(TablePaginationService);
    expect(service).toBeTruthy();
  });
});

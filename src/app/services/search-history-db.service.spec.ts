import { TestBed } from '@angular/core/testing';

import { SearchHistoryDbService } from './search-history-db.service';

describe('SearchHistoryDbService', () => {
  let service: SearchHistoryDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchHistoryDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

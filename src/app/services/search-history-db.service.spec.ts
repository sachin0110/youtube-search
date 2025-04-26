import { TestBed } from '@angular/core/testing';

import { SearchHistoryDB } from './search-history-db.service';

describe('SearchHistoryDbService', () => {
  let service: SearchHistoryDB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchHistoryDB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

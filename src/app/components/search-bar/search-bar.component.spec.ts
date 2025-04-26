import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { SearchHistoryDB } from '../../services/search-history-db.service';
import { SharedService } from '../../services/shared.service';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let searchHistoryDBMock: jasmine.SpyObj<SearchHistoryDB>;
  let sharedServiceMock: jasmine.SpyObj<SharedService>;

  beforeEach(async () => {
    searchHistoryDBMock = jasmine.createSpyObj('SearchHistoryDB', [
      'searchSuggestions',
      'addSearchTerm',
    ]);
    searchHistoryDBMock.searchSuggestions.and.returnValue(Promise.resolve([]));

    sharedServiceMock = jasmine.createSpyObj('SharedService', ['updateValue']);

    await TestBed.configureTestingModule({
      imports: [
        SearchBarComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: SearchHistoryDB, useValue: searchHistoryDBMock },
        { provide: SharedService, useValue: sharedServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event when search button is clicked', () => {
    spyOn(component.search, 'emit');
    component.searchControl.setValue('Angular');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.search-button'));
    button.nativeElement.click();

    expect(component.search.emit).toHaveBeenCalledWith('Angular');
  });

  it('should emit search event when enter key is pressed', () => {
    spyOn(component.search, 'emit');
    component.searchControl.setValue('Angular');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.search-input'));
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    input.nativeElement.dispatchEvent(event);

    expect(component.search.emit).toHaveBeenCalledWith('Angular');
  });

  it('should clear search term when clear button is clicked', () => {
    spyOn(component.search, 'emit');
    component.searchControl.setValue('Angular');
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeTruthy();
    clearButton.nativeElement.click();

    expect(component.searchControl.value).toBe('');
    expect(component.search.emit).toHaveBeenCalledWith('');
  });

  it('should not show clear button when search term is empty', () => {
    component.searchControl.setValue('');
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeNull();
  });

  it('should show clear button when search term is not empty', () => {
    component.searchControl.setValue('Angular');
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeTruthy();
  });
});

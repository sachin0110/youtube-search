import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, FormsModule]
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
    component.searchTerm = 'Angular';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.search-button'));
    button.nativeElement.click();

    expect(component.search.emit).toHaveBeenCalledWith('Angular');
  });

  it('should emit search event when enter key is pressed', () => {
    spyOn(component.search, 'emit');
    component.searchTerm = 'Angular';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.search-input'));
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    input.nativeElement.dispatchEvent(event);

    expect(component.search.emit).toHaveBeenCalledWith('Angular');
  });

  it('should clear search term when clear button is clicked', () => {
    spyOn(component.search, 'emit');
    component.searchTerm = 'Angular';
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeTruthy();
    clearButton.nativeElement.click();

    expect(component.searchTerm).toBe('');
    expect(component.search.emit).toHaveBeenCalledWith('');
  });

  it('should not show clear button when search term is empty', () => {
    component.searchTerm = '';
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeNull();
  });

  it('should show clear button when search term is not empty', () => {
    component.searchTerm = 'Angular';
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.clear-button'));
    expect(clearButton).toBeTruthy();
  });
});

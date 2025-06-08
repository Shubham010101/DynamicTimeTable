import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTableFormComponent } from './time-table-form.component';

describe('TimeTableFormComponent', () => {
  let component: TimeTableFormComponent;
  let fixture: ComponentFixture<TimeTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeTableFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

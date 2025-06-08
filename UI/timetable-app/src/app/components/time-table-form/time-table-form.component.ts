import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputModel, SubjectHourModel } from '../../models/input.model';
import { TimeTableService } from '../../services/time-table.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-time-table-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './time-table-form.component.html',
  styleUrls: ['./time-table-form.component.css']
})
export class TimeTableFormComponent {
  @ViewChild('step2') step2Ref!: ElementRef;
  @ViewChild('step3') step3Ref!: ElementRef;
  input: InputModel = { workingDays: 5, subjectsPerDay: 4, totalSubjects: 4 };
  subjectHours: SubjectHourModel[] = [];
  timeTable: string[][] = [];

  constructor(private api: TimeTableService) {}


// Returns the total required hours
get totalHoursRequired(): number {
  return this.input.workingDays * this.input.subjectsPerDay;
}

// Sums the entered subject hours
get totalHoursEntered(): number {
  return this.subjectHours.reduce((sum, s) => sum + (s.hours || 0), 0);
}

// Validates total and checks each subject has a name and hours
areSubjectHoursValid(): boolean {
  return (
    this.totalHoursEntered === this.totalHoursRequired &&
    this.subjectHours.every(s => s.subjectName.trim() !== '' && s.hours > 0)
  );
}


  // Step 1: Generate empty subject hour fields based on total subjects
generateSubjects() {
  const request: InputModel = {
    workingDays: this.input.workingDays,
    subjectsPerDay: this.input.subjectsPerDay,
    totalSubjects: this.input.totalSubjects,
    subjects: []  // empty at this step
  };

  this.api.generateSubjects(request).subscribe({
    next: (data) => {
      this.subjectHours = data;
    },
    error: (err) => {
      console.error('Error generating subjects:', err);
      alert('Failed to get subject template from API.');
    }
  });

  setTimeout(() => {
      this.step2Ref?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100)
}


generateTimeTable() {
  console.log('generateTimeTable called');

  this.api.generateTimeTable(
    this.subjectHours,
    this.input.workingDays,
    this.input.subjectsPerDay
  ).subscribe({
    next: (data) => {
      this.timeTable = data;
      console.log('Timetable generated:', data);
    },
    error: (err) => {
      console.error('Error generating timetable:', err);
      alert('Failed to generate timetable.');
    }
  });

  setTimeout(() => {
      this.step3Ref?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

enforceRange(event: Event, field: 'workingDays' | 'subjectsPerDay', min: number, max: number): void {
  const inputEl = event.target as HTMLInputElement;
  let value = Number(inputEl.value);

  if (value > max) {
    inputEl.value = max.toString();
    this.input[field] = max;
  } else if (value < min) {
    inputEl.value = min.toString();
    this.input[field] = min;
  } else {
    this.input[field] = value;
  }
}

resetAll(): void {
  this.input = { workingDays: 5, subjectsPerDay: 4, totalSubjects: 4 };
  this.subjectHours = [];
  this.timeTable = [];
}

 exportToExcel(): void {
    // Create headers array
    const headers = this.timeTable[0].map((_, i) => `Day ${i + 1}`);

    // Add headers as the first row of data
    const dataWithHeaders = [headers, ...this.timeTable];

    // Convert to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);
   

    // Create workbook and add worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Time Table': worksheet },
      SheetNames: ['Time Table']
    };

    // Write workbook with styles (bookType: 'xlsx', type: 'binary' for styles)
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    // Create blob and save file
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    saveAs(blob, 'TimeTable.xlsx');
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InputModel, SubjectHourModel } from '../models/input.model';

@Injectable({
  providedIn: 'root',
})
export class TimeTableService {
  private apiUrl = 'https://localhost:7120/api/timetable'; // Backend URL

  constructor(private http: HttpClient) {}

  // POST /api/timetable/generate
  generateSubjects(input: InputModel): Observable<SubjectHourModel[]> {
  // Make sure to send the full object with subjects as empty array on first call
  const body = {
    workingDays: input.workingDays,
    subjectsPerDay: input.subjectsPerDay,
    totalSubjects: input.totalSubjects,
    subjects: []  // empty array when generating subject list
  };

  return this.http.post<SubjectHourModel[]>(`${this.apiUrl}/generate`, body);
}


  // POST /api/timetable/timetable
generateTimeTable(
  subjects: SubjectHourModel[],
  workingDays: number,
  subjectsPerDay: number
): Observable<string[][]> {
  const params = {
    workingDays: workingDays.toString(),
    subjectsPerDay: subjectsPerDay.toString()
  };

  return this.http.post<string[][]>(
    `${this.apiUrl}/timetable`,
    subjects,
    { params }
  );
}



}




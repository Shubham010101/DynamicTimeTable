
export interface InputModel {
  workingDays: number;
  subjectsPerDay: number;
  totalSubjects: number;
  subjects?: SubjectHourModel[]; // optional for generating subjects
}

export interface SubjectHourModel {
  subjectName: string;
  hours: number;
}
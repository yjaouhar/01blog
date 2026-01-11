import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enveronment';
import { GlobalResponce } from '../model/globalResponce.type';
import { Reports } from '../model/reportes.type';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  http = inject(HttpClient)

  getReports() {
    return this.http.get<GlobalResponce<Reports[]>>(`${environment.apiUrl}/api/admin/report`).pipe(
      catchError(err => throwError(() => err))
    )
  };


  react(reaction: {
    reportId: string,
    remove: boolean,
    status: boolean
  }) {
    return this.http.post<GlobalResponce<string>>(`${environment.apiUrl}/api/admin/report_reaction`, reaction).pipe(
      catchError(err => throwError(() => err))
    )
  }

}

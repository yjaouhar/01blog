import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enveronment';
import { HttpClient } from '@angular/common/http';
import { GlobalResponce } from '../model/globalResponce.type';
import { DiscoverModel } from '../model/discover.type';
import { catchError, throwError } from 'rxjs';
import { AdminPost, Post, PostModel } from '../model/post.type';
import { Reports } from '../model/reportes.type';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  http = inject(HttpClient);
  url = environment.apiUrl;
  getReports() {
    return this.http.get<GlobalResponce<Reports[]>>(`${environment.apiUrl}/api/admin/report`).pipe(
      catchError(err => throwError(() => err))
    )
  };
  deletReport(id: string) {
    return this.http.delete<GlobalResponce<string>>(`${environment.apiUrl}/api/admin/report/${id}`).pipe(
      catchError(err => throwError(() => err))
    )
  };
  relevReport(id: string) {
    return this.http.patch<GlobalResponce<string>>(`${environment.apiUrl}/api/admin/report`, { targetId: id }).pipe(
      catchError(err => throwError(() => err))
    )
  };
  getUsers() {
    return this.http.get<GlobalResponce<DiscoverModel>>(`${environment.apiUrl}/api/users`).pipe(
      catchError(err => throwError(() => err))
    )
  };
  getPoste(id: string) {
    return this.http.get<GlobalResponce<Post>>(`${environment.apiUrl}/api/admin/poste/${id}`).pipe(
      catchError(err => throwError(() => err))
    )
  };
  getPostes() {
    return this.http.get<GlobalResponce<PostModel<AdminPost>>>(`${environment.apiUrl}/api/admin/postes`).pipe(
      catchError(err => throwError(() => err))
    )
  };
  deletUser(id: string) {
    return this.http.delete<GlobalResponce<string>>(`${environment.apiUrl}/api/admin/user/${id}`).pipe(
      catchError(err => throwError(() => err))
    )
  }
  banUser(id: string) {
    return this.http.patch<GlobalResponce<string>>(`${environment.apiUrl}/api/admin/user`, { userId: id }).pipe(
      catchError(err => throwError(() => err))
    )
  }
  deletPost(id: string) {
    return this.http.delete<GlobalResponce<string>>(`${environment.apiUrl}/api/admin/post/${id}`).pipe(
      catchError(err => throwError(() => err))
    )
  }
  banPost(id: string) {
    return this.http.patch<GlobalResponce<string>>(`${environment.apiUrl}/api/admin/post`, { userId: id }).pipe(
      catchError(err => throwError(() => err))
    )
  }
}

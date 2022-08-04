import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class LogsService {
  private dataStore: {
    logs: [];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { logs: [] };
  }

  getAllLogs(): Observable<any> {
    const getURL = `http://localhost:3000/log/`;
    return this.http.get<any>(getURL);
  }
}

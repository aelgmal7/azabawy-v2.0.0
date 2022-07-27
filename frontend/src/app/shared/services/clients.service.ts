import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewClient } from 'src/app/pages/accounting/suppliers/add-supplier/add-supplier.component';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private getURL = 'http://localhost:3000/client';
  private postURL = 'http://localhost:3000/client/add-client';

  private dataStore: {
    clients;
  };

  constructor(private http: HttpClient) {
    this.dataStore = { clients: [] };
  }

  getAllClients(): Observable<any> {
    return this.http.get(this.getURL);
  }

  addNewClient(newClient: NewClient): Observable<NewClient> {
    return this.http.post<NewClient>(this.postURL, newClient);
  }

  updateClient(client: NewClient, id): Observable<NewClient> {
    const UpdateURL = `http://localhost:3000/client/${id}`;
    return this.http.put<NewClient>(UpdateURL, client);
  }

  deleteClient(id: number): Observable<number> {
    const deleteURL = `http://localhost:3000/client/${id}`;
    return this.http.delete<number>(deleteURL);
  }

  getClientOperations(clientId): Observable<any> {
    const getURL = `http://localhost:3000/client/conc/${clientId}`;
    return this.http.get<any>(getURL);
  }
}

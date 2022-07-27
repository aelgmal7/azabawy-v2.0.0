import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMaterials } from 'src/app/pages/materials/materials.component';

@Injectable({
  providedIn: 'root',
})
export class MaterialsService {
  private PostURL = 'http://localhost:3000/material/add-material';
  private Url = 'http://localhost:3000/material/';

  private dataStore: {
    materials: [];
  };

  constructor(private http: HttpClient) {
    this.dataStore = { materials: [] };
  }

  getAllMaterials(): Observable<any> {
    return this.http.get<any>(this.Url);
  }

  addNewMaterial(newMaterial: IMaterials): Observable<IMaterials> {
    return this.http.post<IMaterials>(this.PostURL, newMaterial);
  }
}

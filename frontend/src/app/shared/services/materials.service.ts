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
  deleteMaterial(id: number): Observable<number> {
    const deleteURL = `http://localhost:3000/material/${id}`;
    return this.http.delete<number>(deleteURL);
  }
  updateMaterial(id: number, material: any): Observable<any> {
    const UpdateURL = `http://localhost:3000/material/${id}`;

    return this.http.put<any>(UpdateURL, material);
  }
  updateAmount(id: number, amount: number, weight: number): Observable<any> {
    const UpdateURL = `http://localhost:3000/material/changeAmountOfWeight/${id}?weight=${weight}&amount=${amount}`;

    return this.http.put<any>(UpdateURL, null);
  }
  deleteWeight(productId: number, weightId: number): Observable<number> {
    const deleteURL = `http://localhost:3000/material/deleteMaterialWeight/${productId}?weight=${weightId}`;
    return this.http.delete<number>(deleteURL);
  }
}

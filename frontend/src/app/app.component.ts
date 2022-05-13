import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  tasks: string[] = [];
  newEntry: string = 'f';
  spam: any = '';

  constructor(private http: HttpClient) {}
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  });

  addTask(): void {
    this.http
      .post<string>(
        'http://localhost:3000/tasks',
        { title: this.newEntry },
        { headers: this.httpHeaders }
      )
      .subscribe((response: any) => {
        console.log('data :>> ', response);
        console.log('data :>> ', typeof response);
         this.tasks = response.result.title;
        console.log(this.tasks);
      });
  }

  ngOnInit() {
    this.http.get('http://localhost:3000/tasks').subscribe((response: any) => {
      console.log('data :>> ', response);
      console.log('data :>> ', typeof response);
      this.tasks = response.result.title;
    });
  }

  push(this: any) {
    this.http
      .get('http://localhost:3000/a', { responseType: 'json' })
      .subscribe((data: any) => {
        console.log('data :>> ', data);
        console.log('data :>> ', typeof data);
        this.tasks.push(data.name);
      });
  }
}

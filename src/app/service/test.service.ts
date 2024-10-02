import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'router/config';
import { testView } from 'router/models/test/testView';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private httpClient:HttpClient) { }
  public insert(testData:testView):Observable<testView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/test/insert`;
    return this.httpClient.post<testView>(url,testData);
  }
  public clear(testData:testView):Observable<testView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/test/clear`;
    return this.httpClient.post<testView>(url,testData);
  }
  public testResults(testData:testView):Observable<testView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/test/test-results`;
    return this.httpClient.post<testView>(url,testData);
  }
  public allTestData(testData:testView):Observable<testView[]> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/test/all-test-data`;
    return this.httpClient.post<testView[]>(url,testData);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private SERVER_URL = environment.url;
    private httpClient: HttpClient;

    constructor(private http: HttpClient) {
        this.httpClient = http;
    }

    public getProductosAll(): Observable<any> {
        return this.httpClient.get(`${this.SERVER_URL}products`).pipe(map(data => data));
    }

    public getMarcasAll(): Observable<any> {
        return this.httpClient.get(`${this.SERVER_URL}brands`).pipe(map(data => data));
    }

    public getDiscountAll(): Observable<any> {
        return this.httpClient.get(`${this.SERVER_URL}discounts`).pipe(map(data => data));
    }
}
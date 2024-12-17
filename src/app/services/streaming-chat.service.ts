import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
// service lưu trữ trạng thái (subscription)
export class StreamingChatService {
  private url = 'http://192.168.1.5/api/chat-messages';
  constructor(private http: HttpClient) {}

  askAi(streamingurl: string, query: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiMTNkMThkMC1mNDIxLTQxMGEtOWM3YS04ZTA4NTMwYWY3ZDgiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiYjEzZDE4ZDAtZjQyMS00MTBhLTljN2EtOGUwODUzMGFmN2Q4IiwiYXBwX2NvZGUiOiJWRXNoczl0UWw2bGRjM3ZxIiwiZW5kX3VzZXJfaWQiOiJhMmYzNjFkZi04OTk0LTQ4NDUtYTk2NS03YzFmOTZlZjkyZjUifQ.9qOCtT3FH5lGaeadxoT6YKaDh6FG0_IVmH6p8CtIU1Q',
    });
    return this.http.post(
      streamingurl,
      {
        response_mode: 'streaming',
        conversation_id: 'ee5322f1-b230-4d1f-8723-e546958cb2d8',
        files: [],
        query: query,
        inputs: {},
        parent_message_id: '6bf664a6-98c0-458d-bcc3-bfd240eee786',
      },
      { headers: headers, responseType: 'text', observe: 'body' }
    );
  }

  getDataSteam(url: string): Observable<any> {
    return this.http.get(url, {
      responseType: 'text',
      observe: 'body',
    });
  }
}

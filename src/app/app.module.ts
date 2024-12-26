import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StreamingChatComponent } from './streaming-chat/streaming-chat.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [AppComponent, StreamingChatComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: 'marked',
        useValue: {
          gfm: true, // Bật chế độ GFM (GitHub Flavored Markdown)
          breaks: true, // Tự động xuống dòng khi gặp \n
          pedantic: false, // Bỏ qua các lỗi trong Markdown
        },
      },
    }),
    FormsModule,
    HttpClientModule,
    MatIconModule,
  ],
  // providers: [],
  // bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const streamingChat = createCustomElement(StreamingChatComponent, {
      injector,
    });
    customElements.define('streaming-chat', streamingChat);
  }
  ngDoBootstrap() {} // Không sử dụng bootstrap component
}

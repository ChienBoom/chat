import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { StreamingChatService } from '../services/streaming-chat.service';

@Component({
  selector: 'streaming-chat',
  templateUrl: './streaming-chat.component.html',
  styleUrls: ['./streaming-chat.component.scss'],
  animations: [
    trigger('chatAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'scale3d(0.8, 0.8, 1)',
          display: 'none', //loại bỏ khỏi layout
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'scale3d(1, 1, 1)',
          display: 'block', //thêm vào layout
        })
      ),
      transition(
        'hidden <=> visible',
        animate('200ms cubic-bezier(0, 1.2, 1, 1)')
      ),
    ]),
  ],
})
export class StreamingChatComponent implements OnInit, OnChanges {
  @Input() ishiddenbutton: boolean = false; //Ẩn button chat
  @Input() showchatfirst: boolean = false; //Mở chat khi khởi động ứng dụng
  @Input() isstream: boolean = true; //Sử dụng chế độ stream trong request
  @Input() isenablehistory: boolean = true; //Sử dụng lịch sử chat
  @Input() firstquestion = 'how can you help me';
  @Input() chattitle = 'Aratech AI'; //Tiêu đề khung chat
  @Input() chatcolor = 'rgb(63, 81, 181)'; // Màu cho khung chat
  @Input() texttitlecolor = 'white'; // Màu cho title khung chat
  @Input() botimageurl = 'assets/images/logo/aratech-logo-picture.png'; // Đường dẫn ảnh cho Bot
  @Input() userimageurl =
    'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'; // Đường dẫn ảnh cho User
  @Input() botchatbackgroundcolor = 'rgb(247, 248, 255)'; // Màu background của Bot
  @Input() userchatbackgroundcolor = 'rgb(63, 81, 181)'; // Màu background của user
  @Input() botchattextcolor = 'rgb(48, 50, 53)'; // Màu text của Bot
  @Input() userchattextcolor = 'rgb(255, 255, 255)'; // Màu text của user
  @Input() botgreeting = 'Hello! How can Aratech help you?'; // Lời chào của Bot
  @Input() placeholderinput = 'Type your question'; // placeholder của phần searchInput
  @Input() heightframe = '550px'; // Chiều cao khung chat(Tính theo px hoặc %)
  @Input() widthframe = '400px'; // Chiều rộng khung chat(Tính theo px hoặc %)
  @Input() position = 'br'; // vị trí button (tl: top-left | tr: top-right | bl: bottom-left | br: bottom-right)
  @Input() xposition = '20'; // giá trị vị trí so với trục x
  @Input() yposition = '14'; //giá trị vị trí so với trục y
  @Input() buttonimageurl = 'assets/images/logo/aratech-logo-picture.png'; // Đường dẫn icon của button
  @Input() borderradius = '6px'; // bo viền cho khung chat
  @Input() chatimageurl = 'assets/images/logo/aratech-logo-picture.png'; //Đường dẫn ảnh Chat
  @Input() chatpowerby = 'Aratech VN'; //Được xây dựng bởi
  @Input() originurlconfig = 'https://flow.ai.aratech.vn'; //Cấu hình origin request url
  @Input() sessionid = 'd5be43de-921c-4f65-8845-175af3cb82d3'; //Cấu hình sessionid request url
  @Input() xapikeyconfig = 'sk-lrw7K_D340w_fPItbtSPitqDgrLWcKHHciLlzFx2JR0'; //Cấu hình xapikey request url
  showChatFrame = false; //hiển thị | ẩn khung chat
  chats: any[] = []; // danh sách đoạn chat
  requestString = ''; //câu hỏi
  currentResponseChat = ''; // câu trả lời hiện tại
  answers: any[] = []; //danh sách các ký tự câu trả lời được hiển thị lên màn hình hiện tại
  isRenderResponse = false; // phản hồi đang được render
  isAutoScroll = true; // tự động cuộn
  isDisableSend = false; // disable button send
  isStopRequest = false; // dừng gửi request
  isCompleteRequest = true; // hoàn thành request
  requestOrigin = 'https://langflow.hientd.vn';
  midurl = '/api/v1/run/';
  tweaks: any = {};
  xPositionKey = 'right';
  yPositionKey = 'bottom';
  xPositionButtonValue = 20;
  yPositionButtonValue = 14;
  xPositionFrameValue = 25;
  yPositionFrameValue = 79;

  private subscription: Subscription | undefined;
  private subscriptionStream: Subscription | undefined;

  @ViewChild('chatMessages') chatMessages!: ElementRef;

  constructor(
    private streamingChatService: StreamingChatService,
    private http: HttpClient
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['ishiddenbutton']) {
      const currentIsHiddentButton = changes?.['ishiddenbutton'].currentValue;
      this.ishiddenbutton = currentIsHiddentButton === 'true' ? true : false;
    }
    if (changes?.['showchatfirst']) {
      const currentshowChatFirst = changes?.['showchatfirst'].currentValue;
      this.showchatfirst = currentshowChatFirst === 'true' ? true : false;
    }
    if (changes?.['isstream']) {
      const currentIsStream = changes?.['isstream'].currentValue;
      this.isstream = currentIsStream === 'true' ? true : false;
    }
    if (changes?.['isenablehistory']) {
      const currentIsEnableHistory = changes?.['isenablehistory'].currentValue;
      this.isenablehistory = currentIsEnableHistory === 'true' ? true : false;
    }
    if (changes?.['xposition']) {
      this.xPositionButtonValue = Number(changes?.['xposition'].currentValue);
      this.xPositionFrameValue = this.xPositionButtonValue + 5;
    }
    if (changes?.['yposition']) {
      this.yPositionButtonValue = Number(changes?.['yposition'].currentValue);
      this.yPositionFrameValue = this.yPositionButtonValue + 65;
    }
    if (changes?.['position']) {
      switch (changes?.['position'].currentValue) {
        case 'tl':
          this.xPositionKey = 'left';
          this.yPositionKey = 'top';
          return;
        case 'tr':
          this.xPositionKey = 'right';
          this.yPositionKey = 'top';
          return;
        case 'bl':
          this.xPositionKey = 'left';
          this.yPositionKey = 'bottom';
          return;
        default:
          this.xPositionKey = 'right';
          this.yPositionKey = 'bottom';
      }
    }
  }

  ngOnInit(): void {
    if (this.isenablehistory) {
      this.chats = localStorage.getItem('ChatHistory')
        ? JSON.parse(localStorage.getItem('ChatHistory')!)
        : [];
    }
    this.requestOrigin = this.originurlconfig;
    this.showChatFrame = this.showchatfirst;
    if (this.chats.length === 0 && this.firstquestion.trim() != '') {
      this.isStopRequest = false;
      this.isRenderResponse = true;
      this.isDisableSend = true;
      this.isCompleteRequest = false;
      this.chats.push({
        question: this.firstquestion,
        text: '',
        responseLoading: true,
      });
      this.isAutoScroll = true;

      setTimeout(() => this.scrollToBottom(), 0);
      this.fetch(this.firstquestion);
      this.requestString = '';
    }
  }

  get buttonStyles() {
    return {
      background: this.chatcolor,
      [this.xPositionKey]: `${this.xPositionButtonValue}px`,
      [this.yPositionKey]: `${this.yPositionButtonValue}px`,
    };
  }

  get frameStyles() {
    return {
      height: this.heightframe,
      width: this.widthframe,
      [this.xPositionKey]: `${this.xPositionFrameValue}px`,
      [this.yPositionKey]: `${this.yPositionFrameValue}px`,
    };
  }

  handleShowChat() {
    this.showChatFrame = !this.showChatFrame;
    if (this.showChatFrame) {
      setTimeout(() => document.getElementById('chat-input')!.focus(), 0);
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  handleResetChat() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      if (this.subscriptionStream) this.subscriptionStream.unsubscribe();
    }
    this.chats = [];
    if (this.isenablehistory) localStorage.removeItem('ChatHistory');
    if (this.firstquestion.trim() != '') {
      this.isStopRequest = false;
      this.isRenderResponse = true;
      this.isDisableSend = true;
      this.isCompleteRequest = false;
      this.chats.push({
        question: this.firstquestion,
        text: '',
        responseLoading: true,
      });
      this.isAutoScroll = true;

      setTimeout(() => this.scrollToBottom(), 0);
      this.fetch(this.firstquestion);
      this.requestString = '';
    }
  }

  hanldeSend() {
    const test = this.chats;
    if (this.isDisableSend) {
      if (this.subscription) {
        this.subscription.unsubscribe();
        if (!this.isstream && !this.isCompleteRequest) {
          this.isCompleteRequest = true;
          this.chats.pop();
        }
        if (this.subscriptionStream) this.subscriptionStream.unsubscribe();
        if (this.isstream && this.currentResponseChat == '') {
          this.isCompleteRequest = true;
          this.chats.pop();
        }
      }
      this.isDisableSend = false;
      this.isStopRequest = true;
      return;
    }
    this.isStopRequest = false;
    this.isRenderResponse = true;
    this.isDisableSend = true;
    this.isCompleteRequest = false;
    this.chats.push({
      question: this.requestString.trim(),
      text: '',
      responseLoading: true,
    });
    this.isAutoScroll = true;

    setTimeout(() => this.scrollToBottom(), 0);
    this.fetch(this.requestString.trim());
    this.requestString = '';
  }

  fetch(question: string) {
    if (this.isstream) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': this.xapikeyconfig,
      });
      this.subscription = this.http
        .post(
          `${this.originurlconfig}${this.midurl}${this.sessionid}?stream=${this.isstream}`,
          {
            input_value: question,
            output_type: 'chat',
            input_type: 'chat',
            tweaks: this.tweaks,
          },
          { headers: headers }
        )
        .subscribe(
          (rs: any) => {
            const streamRequest = `${this.requestOrigin}${rs.outputs[0].outputs[0].artifacts.stream_url}`;
            this.subscriptionStream = this.streamingChatService
              .getDataSteam(streamRequest)
              .subscribe({
                next: (res: any) => {
                  res.split('\n').forEach((line: any) => {
                    if (line.trim()) {
                      if (line.startsWith('event')) {
                        if (line.endsWith('close')) return;
                      } else {
                        const stringData = line.replace('data: ', '');
                        try {
                          const data = JSON.parse(stringData);
                          if (
                            data?.chunk.trim() &&
                            data?.chunk.trim().length > 0
                          ) {
                            this.answers.push(data.chunk);
                            if (this.answers.length == 1) this.typeEffect();
                          }
                        } catch (er) {
                          // console.log(er)
                        }
                      }
                    }
                  });
                },
                error: (error: any) => {
                  console.error(error);
                  this.answers.push('Sorry! Server Error');
                  this.typeEffect();
                  setTimeout(() => this.scrollToBottom(), 0);
                },
                complete: () => {
                  console.log('complete stream');
                  // this.isCompleteRequest = true;
                },
              });
          },
          (error: any) => {
            console.error(error);
            this.answers.push('Sorry! Server Error');
            this.typeEffect();
            setTimeout(() => this.scrollToBottom(), 0);
          },
          () => {
            console.log('complete');
            this.isCompleteRequest = true;
          }
        );
    } else {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': this.xapikeyconfig,
      });
      this.subscription = this.http
        .post(
          `${this.originurlconfig}${this.midurl}${this.sessionid}?stream=${this.isstream}`,
          {
            input_value: question,
            output_type: 'chat',
            input_type: 'chat',
            tweaks: this.tweaks,
          },
          { headers: headers }
        )
        .subscribe(
          (rs: any) => {
            this.answers.push(rs.outputs[0].outputs[0].messages[0].message);
            this.typeEffect();
          },
          (error) => {
            console.error(error);
            this.answers.push('Sorry! Server Error');
            this.typeEffect();
            setTimeout(() => this.scrollToBottom(), 0);
          },
          () => {
            console.log('complete');
            this.isCompleteRequest = true;
          }
        );
    }
  }

  typeEffect() {
    this.isRenderResponse = false;
    if (this.answers.length === 0) {
      return;
    }
    let index = 0;
    const typing = () => {
      if (this.isStopRequest) {
        this.isDisableSend = false;
        this.isStopRequest = false;
        this.saveCurrentChat();
        return;
      }
      if (this.answers.length > 0 && index < this.answers[0].length) {
        this.currentResponseChat += this.answers[0][index];
        index++;
        setTimeout(() => this.scrollToBottom(), 0);
        requestAnimationFrame(typing);
      } else {
        this.answers.shift();
        index = 0;
        if (this.answers.length === 0) {
          this.saveCurrentChat();
        } else {
          setTimeout(() => this.scrollToBottom(), 0);
          requestAnimationFrame(typing);
        }
      }
    };

    requestAnimationFrame(typing);
  }

  saveCurrentChat() {
    const question = this.chats[this.chats.length - 1]?.question;
    const text = this.currentResponseChat;
    this.chats.pop();
    this.chats.push({
      question: question,
      text: text,
      responseLoading: false,
    });
    if (this.isenablehistory) {
      localStorage.setItem('ChatHistory', JSON.stringify(this.chats));
    }
    this.currentResponseChat = '';
    this.isDisableSend = false;
    this.answers = [];
    setTimeout(() => this.scrollToBottom(), 0);
  }

  handleScroll(event: any) {
    if (
      Math.abs(
        event.target.scrollHeight -
          event.target.scrollTop -
          event.target.clientHeight
      ) < 1
    ) {
      this.isAutoScroll = true;
      return;
    }
    this.isAutoScroll = false;
  }

  handleKeydDownChat(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.isDisableSend) this.hanldeSend();
    }
  }

  scrollToBottom() {
    if (!this.isAutoScroll) return;
    const crollHeight = this.chatMessages.nativeElement.scrollHeight;
    this.chatMessages.nativeElement.scrollTop = crollHeight;
  }
}

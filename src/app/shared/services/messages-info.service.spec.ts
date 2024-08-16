import { TestBed } from '@angular/core/testing';

import { MessagesInfoService } from './messages-info.service';

describe('MessagesInfoService', () => {
  let service: MessagesInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

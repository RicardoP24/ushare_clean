import { TestBed } from '@angular/core/testing';

import { MensagemSucessoService } from './mensagem-sucesso.service';

describe('MensagemSucessoService', () => {
  let service: MensagemSucessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensagemSucessoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

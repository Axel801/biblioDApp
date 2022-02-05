import { TestBed } from '@angular/core/testing';

import { LibroNFTService } from './libro-nft.service';

describe('LibroNFTService', () => {
  let service: LibroNFTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibroNFTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

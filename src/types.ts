import { RequestInit } from 'node-fetch';

export interface TranslateOptions {
  from?: string;
  to?: string;
  host?: string;
  fetchOptions?: Partial<RequestInit>;
}

export interface TranslateResult {
  text: string;
  raw: RawResponse;
}

export interface RawResponse {
  sentences: (Sentence | SrcTranslit)[];
  src: string;
  confidence: number;
  ld_result: {
    srclangs: string[];
    srclangs_confidences: number[];
    extended_srclangs: string[];
  }
}

export interface Sentence {
  trans: string;
  orig: string;
}

export interface SrcTranslit {
  src_translit: string;
}

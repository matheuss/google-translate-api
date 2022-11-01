import fetch from 'node-fetch';
import createHttpError from 'http-errors';
import { RawResponse, Sentence, TranslateOptions } from './types.js';

const defaults: Required<Pick<TranslateOptions, 'from' | 'to' | 'host'>> = {
  from: 'auto',
  to: 'en',
  host: 'translate.google.com',
};

export async function translate(inputText: string, options?: TranslateOptions) {
  return new Translator(inputText, options).translate();
}

export class Translator {
  protected options: typeof defaults & TranslateOptions;

  constructor(protected inputText: string, options?: TranslateOptions) {
    this.options = Object.assign({}, defaults, options);
  }

  async translate() {
    const url = this.buildUrl();
    const fetchOptions = this.buildFetchOptions();
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw createHttpError(res.status, res.statusText);
    const raw = await res.json() as RawResponse;
    const text = this.buildResText(raw);
    return { text, raw };
  }

  protected buildUrl() {
    const { host } = this.options;
    return [
      `https://${host}/translate_a/single`,
      '?client=at',
      '&dt=t',  // return sentences
      '&dt=rm', // add translit to sentences
      '&dj=1',  // result as pretty json instead of deep nested arrays
    ].join('');
  }

  protected buildBody() {
    const { from, to } = this.options;
    const params = {
      sl: from,
      tl: to,
      q: this.inputText,
    };
    return new URLSearchParams(params).toString();
  }

  protected buildFetchOptions() {
    const { fetchOptions } = this.options;
    const res = Object.assign({}, fetchOptions);
    res.method = 'POST';
    res.headers = Object.assign({}, res.headers, {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    });
    res.body = this.buildBody();
    return res;
  }

  protected buildResText({ sentences }: RawResponse) {
    return sentences
      .filter((s): s is Sentence => 'trans' in s)
      .map(s => s.trans)
      .join('');
  }
}

export interface TextClient {
  send({body, to, from}: Message): object;
}

export interface Message {
  body: string;
  to: string;
  from?: string;
}

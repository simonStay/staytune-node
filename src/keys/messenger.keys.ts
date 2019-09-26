import {BindingKey} from '@loopback/context';
import {TextClient} from '../types';

export namespace MessengerBindings {
  export const TEXT_CLIENT = BindingKey.create<TextClient>(
    'messenger.text.client',
  );
}

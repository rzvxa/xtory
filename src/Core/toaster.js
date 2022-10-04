import React from 'react';
import toaster from 'rsuite/toaster'

import { Message } from 'rsuite';

const message = (type, placement) => (
    <Message showIcon type={type}>
      {type}: {placement}
    </Message>
);

export default class Toaster {
  static info(msg) {
    this.toast('info', msg);
  }
  static success(msg) {
    this.toast('success', msg);
  }
  static warning(msg) {
    this.toast('warning', msg);
  }
  static error(msg) {
    this.toast('error', msg);
  }
  static toast(type, msg) {
    toaster.push(message(type, msg), 'topCenter')
  }
}

/**
 * Pickup
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Pickup {
  constructor(options = {}) {
    // 設定
    this.url = options.url;

    // 要素
    this.elem = options.elem || document.querySelector('.pickup__items');
    this.template = options.template || document.getElementById('pickupTemplate');
    if (!this.elem || !this.template) return;
    this.overlay = document.querySelector('.pickup__overlay');

    // データを取得してレンダリング
    this._fetch(this.url);
  }

  async _fetch(url) {
    const res = await fetch(`${url}pickupitems.json?`);
    const data = await res.json();

    this._render(data);
  }


  _render(data) {
    const len = data.length;
    for (let i = 0; i < len; i++) {
      const clone = this.template.content.cloneNode(true);
      const item = clone.querySelector('.pickup__item');
      const input1 = clone.querySelector('.pickup__src');
      const input2 = clone.querySelector('.pickup__caption');
      const input3 = clone.querySelector('.pickup__href');

      item.dataset.id = i;
      input1.value = data[i].src;
      input2.value = data[i].caption;
      input3.value = data[i].href;

      this.elem.appendChild(clone);

      // 各々イベントハンドラを登録
      this._handleEvents(i);
    };
  }

  _handleEvents(id) {
    const item = document.querySelector(`.pickup__item[data-id="${id}"]`);
    const refresh = item.querySelector('.icon.--refresh');

    refresh.addEventListener('click', () => {
      this.update(item);
    });
  }

  update(item) {
    const id = item.dataset.id;
    const src = item.querySelector('.pickup__src').value;
    const caption = item.querySelector('.pickup__caption').value;
    const href = item.querySelector('.pickup__href').value;

    if (!src == '' && !caption == '') {
      // データの更新をPUT
      const url = this.url;
      const data = {
        src: src,
        caption: caption,
        href: href
      }

      fetch(`${url}pickupitems/${id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      this.reset();
    }
  }

  reset() {
    this.elem.innerHTML = '';
    this.overlay.classList.remove('--collapse');

    setTimeout(() => {
      this._fetch(this.url)
        .then(() => this.overlay.classList.add('--collapse'));
    }, 1000);
  }
}

/**
 * News feed
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Newsfeed {
  constructor(options = {}) {
    // 設定
    this.url = options.url;

    // 要素
    this.elem = options.elem || document.querySelector('.news__feed');
    this.template = options.template || document.getElementById('newsTemplate');
    if (!this.elem || !this.template) return;
    this.overlay = document.querySelector('.news__overlay');

    // データを取得してレンダリング
    this._fetch(this.url);
  }

  async _fetch(url) {
    const res = await fetch(`${url}datecontent.json?`);
    const data = await res.json();

    this._render(data);
  }


  _render(data) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      //console.log(data[key]);

      const clone = this.template.content.cloneNode(true);
      const tr = clone.querySelector('.news__feedItem');
      const input1 = clone.querySelector('.news__date');
      const textarea = clone.querySelector('.news__text');
      const input2 = clone.querySelector('.news__href');

      tr.dataset.date = key;
      input1.value = key;
      input2.value = data[key].href;
      textarea.value = data[key].text;

      this.elem.insertBefore(clone, this.elem.firstChild);

      // 各々イベントハンドラを登録
      this._handleEvents(key);
    });

    let today = new Date();
    today = today.toLocaleString().slice(0, 10);
    today = today.replaceAll('/', '-');

    if (!keys.includes(today)) this.addNew();
  }

  addNew() {
    // コントロールを追加
    const clone = this.template.content.cloneNode(true);
    const tr = clone.querySelector('.news__feedItem');
    const input1 = clone.querySelector('.news__date');
    const textarea = clone.querySelector('.news__text');
    const input2 = clone.querySelector('.news__href');

    let today = new Date();
    today = today.toLocaleString().slice(0, 10);
    today = today.replaceAll('/', '-');

    tr.dataset.date = today;
    input1.value = today;
    input2.value = '';
    textarea.value = '';

    this.elem.insertBefore(clone, this.elem.firstChild);

    // 各々イベントハンドラを登録
    this._handleEvents(today);
  }

  _handleEvents(key) {
    const item = document.querySelector(`[data-date="${key}"]`);
    const refresh = item.querySelector('.icon.--refresh');
    const trash = item.querySelector('.icon.--trash');

    refresh.addEventListener('click', () => {
      this.update(item);
    });

    trash.addEventListener('click', () => {
      this.delete(item);
    });
  }

  update(item) {
    const date = item.querySelector('.news__date').value;
    const text = item.querySelector('.news__text').value;
    const href = item.querySelector('.news__href').value;

    if (!text == '') {
      // データの更新をPUT
      const url = this.url;
      const data = {
        text: text,
        href: href
      }

      fetch(`${url}datecontent/${date}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      this.reset();
    }
  }

  delete(item) {
    const date = item.querySelector('.news__date').value;

    if (!date == '') {
      // データを削除
      const url = this.url;
      fetch(`${url}datecontent/${date}.json`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
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

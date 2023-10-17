/**
 * Calendar
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Calendar {
  constructor(options = {}) {
    // 日本語表記の定義
    // 0: 1月, 1: 2月...なので注意
    this._months = [
      '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    this._weeks = [
      '日', '月', '火', '水', '木', '金', '土'
    ];

    // 要素の定義
    this._elem = options.elem || document.getElementById('calendar');
    this._prev = this._elem.querySelector('.calendar__prev');
    this._next = this._elem.querySelector('.calendar__next');
    this._prevText = this._elem.querySelector('.calendar__prevText');
    this._currentText = this._elem.querySelector('.calendar__currentText');
    this._nextText = this._elem.querySelector('.calendar__nextText');
    this._head = this._elem.querySelector('.calendar__head');
    this._body = this._elem.querySelector('.calendar__body');

    // 現在年月を取得
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();

    // オプション
    this.options = options;
    let month = options.month ? options.month % 12 : 0;
    let year = options.year ? options.year : 0;
    year += (this.month + month > 11) ? 1 : 0;

    // 年月を修正
    this.month = (this.month + month) % 12;
    this.year += year;

    // カレンダーを作成
    this.makeCalendar(this.year, this.month);

    // 月送りの操作受付
    this._handleEvents();
  }

  _handleEvents() {
    if (!this._prev || !this._next) return;

    // 前月
    this._prev.addEventListener('click', (event) => {
      event.preventDefault();
      this.month--;
      if (this.month < 0) {
        this.year--;
        this.month = this._months.length - 1;
      }
      this.makeCalendar(this.year, this.month);
    });

    // 次月
    this._next.addEventListener('click', (event) => {
      event.preventDefault();
      this.month++;
      if (this.month > this._months.length - 1) {
        this.year++;
        this.month = 0;
      }
      this.makeCalendar(this.year, this.month);
    });
  }

  makeCalendar(year, month) {
    // テキストラベルを変更
    this._changeLabels(year, month);
    // Headに曜日を記載
    this._makeCalendarHead();
    // Bodyに日にちを記載
    this._makeCalendarBody(year, month);
  }

  _changeLabels(year, month) {
    if (this._prevText) {
      this._prevText.textContent = this._months[(month + this._months.length - 1) % this._months.length];
    }
    if (this._currentText) {
      this._currentText.textContent = `${year}年 ${this._months[month]}`;
    }
    if (this._nextText) {
      this._nextText.textContent = this._months[(month + this._months.length + 1) % this._months.length];
    }
  }

  _makeCalendarHead() {
    // 現在の中身を削除
    this._head.innerHTML = '';
    // 一週間の行を作成
    const tr = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
      // 一日の列に曜日を記載
      const th = document.createElement('th');
      th.textContent = this._weeks[i];
      tr.appendChild(th);
    }
    this._head.appendChild(tr);
  }

  _makeCalendarBody(year, month) {
    const startDate = new Date(year, month); // 月の初日
    const startDay = startDate.getDay(); // 初日の曜日
    const endDate = new Date(year, month + 1, 0); // 月の末日
    const endDayCount = endDate.getDate(); // 末日の日にち
    let dayCount = 1; // 日にちをカウント

    // 現在の中身を削除
    this._body.innerHTML = '';

    for (let j = 0; j < 6; j++) {
      // 一週間の行を作成
      const tr = document.createElement('tr');

      for (let i = 0; i < 7; i++) {
        //一日の列を作成
        const td = document.createElement('td');
        if (i < startDay && j === 0 || dayCount > endDayCount) {
          // 一週目で、初日の曜日に達するまでは空白
          // もしくは末日の日にちに達してからは空白
          td.innerHTML = '&nbsp;';
        } else {
          // 日にちを記載
          td.innerHTML = `<span>${dayCount}</span>`;
          // 日にち・曜日データをセット
          const date = this._parseDate(year, month, dayCount);
          td.dataset.date = date;
          const week = i;
          td.dataset.week = week;
          // 翌日へ
          dayCount++;
        }
        tr.appendChild(td);
      }
      this._body.appendChild(tr);
    }
  }

  _parseDate(year, month, day) {
    return `${year}-${('00' + (month + 1)).slice(-2)}-${('00' + day).slice(-2)}`;
  }
}

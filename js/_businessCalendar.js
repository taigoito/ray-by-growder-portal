/**
 * Business Calendar
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import Calendar from './_calendar.js';

export default class BusinessCalendar extends Calendar {
  async makeCalendar(year, month) {
    super.makeCalendar(year, month);
    this._setStatus();
  }

  _handleEvents() {
    super._handleEvents();

    // モードの選択受付
    const mode = document.getElementById('calendarMode');
    mode.addEventListener('change', () => {
      this._elem.classList.toggle('--editMode');
    });

    // セルのデータ操作受付
    this._body.addEventListener('click', (event) => this._cellClickHandler(event));
  }

  _setStatus() {
    const elems = this._body.querySelectorAll('[data-date]');
    elems.forEach((td) => {
      // 週のデフォルト値
      const week = td.dataset.week;
      let state = (week == 0) ? 0 : (week == 6) ? 1 : 2;

      //
      // データがあれば、状態値を上書きする処理を書く
      //

      td.dataset.state = state;
    });
  }

  _cellClickHandler(event) {
    // 編集モード時のみ受付
    if (!(this._elem.classList.contains('--editMode'))) return;

    // 状態値を更新
    const target = event.target;
    let state = target.dataset.state;
    state = (state + 1) % 3;
    target.dataset.state = state;

    //
    // データの更新をPUTする処理を書く
    //

  }
}

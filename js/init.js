/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

// Config
import { url } from './config.js';

import Newsfeed from './_newsfeed.js';
new Newsfeed({
  url: url
});

import Pickup from './_pickup.js';
new Pickup({
  url: url
});

import BusinessCalendar from './_businessCalendar.js';
new BusinessCalendar({
  url: url
});

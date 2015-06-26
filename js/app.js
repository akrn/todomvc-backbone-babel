import Backbone from 'backbone';
import $ from 'jquery';

import AppView from './views/app-view.js';
import TodoRouter from './routers/router.js';
import todos from './collections/todos.js';


export const ENTER_KEY = 13;
export const ESC_KEY = 27;

$(() => {
    new AppView({ collection: todos });
    new TodoRouter();
    Backbone.history.start();
});

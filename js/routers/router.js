import Backbone from 'backbone';

import todos from '../collections/todos.js';


export let TodoFilter = '';

export default class TodoRouter extends Backbone.Router {

    routes() {
        return {
            '*filter': 'setFilter'
        }
    }

    setFilter(param = '') {
        TodoFilter = param;

        todos.trigger('filter');
    }

}
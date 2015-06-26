import Backbone from 'backbone';
import BackboneLocalStorage from 'backbone.localstorage';

import Todo from '../models/todo.js';


class Todos extends Backbone.Collection {

    get model() {
        return Todo;
    }

    get localStorage() {
        return new BackboneLocalStorage('todos-backbone');
    }

    completed() {
        return this.where({completed: true});
    }

    remaining() {
        return this.where({completed: false});
    }

    nextOrder() {
        return this.length ? this.last().get('order') + 1 : 1;
    }

}

let todos = new Todos();
export default todos;

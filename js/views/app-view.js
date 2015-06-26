import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

import {ENTER_KEY} from '../app.js';
import {TodoFilter} from '../routers/router.js';
import TodoView from './todo-view.js';


export default class AppView extends Backbone.View {

    get el() {
        return '#todoapp';
    }

    get events() {
        return {
            'keypress #new-todo': 'createOnEnter',
            'click #clear-completed': 'clearCompleted',
            'click #toggle-all': 'toggleAllComplete'
        };
    }

    constructor(...args) {
        super(...args);

        this.statsTemplate = _.template($('#stats-template').html());

        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');
        this.$list = $('#todo-list');

        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this.collection, 'change:completed', this.filterOne);
        this.listenTo(this.collection, 'filter', this.filterAll);
        this.listenTo(this.collection, 'all', this.render);

        this.collection.fetch({ reset: true });
    }

    render() {
        const completed = this.collection.completed().length;
        const remaining = this.collection.remaining().length;

        if (this.collection.length) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));

            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/' + (TodoFilter || '') + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    }

    addOne(todo) {
        var view = new TodoView({ model: todo });
        this.$list.append(view.render().el);
    }

    addAll() {
        this.$list.html('');
        this.collection.each(this.addOne, this);
    }

    filterOne(todo) {
        todo.trigger('visible');
    }

    filterAll() {
        this.collection.each(this.filterOne, this);
    }

    newAttributes() {
        return {
            title: this.$input.val().trim(),
            order: this.collection.nextOrder(),
            completed: false
        };
    }

    createOnEnter(e) {
        if (e.which === ENTER_KEY && this.$input.val().trim()) {
            this.collection.create(this.newAttributes());
            this.$input.val('');
        }
    }

    clearCompleted() {
        _.invoke(this.collection.completed(), 'destroy');
        return false;
    }

    toggleAllComplete() {
        var completed = this.allCheckbox.checked;

        this.collection.each(function (todo) {
            todo.save({
                completed: completed
            });
        });
    }

}
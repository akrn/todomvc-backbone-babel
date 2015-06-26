import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

import {ENTER_KEY, ESC_KEY} from '../app.js';
import {TodoFilter} from '../routers/router.js';


export default class AppView extends Backbone.View {
    
    get tagName() {
        return 'li';
    }

    get events() {
        return {
            'click .toggle': 'toggleCompleted',
            'dblclick label': 'edit',
            'click .destroy': 'clear',
            'keypress .edit': 'updateOnEnter',
            'keydown .edit': 'revertOnEscape',
            'blur .edit': 'close'
        };
    }

    constructor(...args) {
        super(...args);

        this.template = _.template($('#item-template').html());

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    }

    render() {
        if (this.model.changed.id !== undefined) {
            return;
        }

        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('completed', this.model.get('completed'));
        this.toggleVisible();
        this.$input = this.$('.edit');
        return this;
    }

    toggleVisible() {
        this.$el.toggleClass('hidden', this.isHidden());
    }

    isHidden() {
        return this.model.get('completed') ?
            TodoFilter === 'active' :
            TodoFilter === 'completed';
    }

    toggleCompleted() {
        this.model.toggle();
    }

    edit() {
        this.$el.addClass('editing');
        this.$input.focus();
    }

    close() {
        var value = this.$input.val();
        var trimmedValue = value.trim();

        if (!this.$el.hasClass('editing')) {
            return;
        }

        if (trimmedValue) {
            this.model.save({ title: trimmedValue });

            if (value !== trimmedValue) {
                this.model.trigger('change');
            }
        } else {
            this.clear();
        }

        this.$el.removeClass('editing');
    }

    updateOnEnter(e) {
        if (e.which === ENTER_KEY) {
            this.close();
        }
    }

    revertOnEscape(e) {
        if (e.which === ESC_KEY) {
            this.$el.removeClass('editing');
            
            this.$input.val(this.model.get('title'));
        }
    }

    clear() {
        this.model.destroy();
    }

}

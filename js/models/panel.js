define([
    'jquery',
    'backbone'
], function(
    $,
    Backbone
) {
    var Panel = Backbone.Model.extend({
        defaults: {
            sum: {
                label: 'Сумма в месяц',
                value: 80000,
                units: 'руб.',
                hint: ''
            },
            rent: {
                label: 'Аренда квартиры',
                value: 16000,
                units: 'руб.',
                hint: ''
            },
            deposit: {
                label: '% по вкладу',
                value: 7,
                units: '%',
                hint: ''
            },
            credit: {
                label: '% по ипотеке',
                value: 12,
                units: '%',
                hint: ''
            },
            total: {
                label: 'Стоимость квартиры',
                value: 4500000,
                units: 'руб.',
                hint: ''
            },
            exist: {
                label: 'Уже есть',
                value: 1000000,
                units: 'руб.',
                hint: ''
            }
        }
    });

    return new Panel();
});
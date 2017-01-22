require.config({
    baseUrl: "js/",
    paths: {
        'jquery': 'lib/jquery-3.1.1.min',
        'underscore': 'lib/underscore-min',
        'backbone': 'lib/backbone-min',
        'localStorage': 'lib/backbone.localStorage-min'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'localStorage': {
            deps: ['backbone'],
            exports: 'LocalStorage'
        }
    }
});

require([
    'jquery',
    'backbone',
    'models/panel',
    'models/table',
    'models/statistics',
    'views/panel',
    'views/table',
    'views/statistics',
    'utils/calc'
], function(
    $,
    Backbone,
    Panel,
    Table,
    Statistics,
    panelView,
    tableView,
    statisticsView,
    calc
){
    'use strict';

    new panelView({model: Panel});
    new statisticsView({model: Statistics});
    new tableView({model: Table});

    Panel.on('change', function() {
        var data = this.toJSON();
        var userData = {
            sum: data.sum.value,
            rent: data.rent.value,
            deposit: data.deposit.value,
            credit: data.credit.value,
            total: data.total.value,
            exist: data.exist.value,
        }
        var calcData = calc(userData);

        Statistics.set(calcData.statistics);
        Table.set('table', calcData.table);
    });

    Panel.trigger('change');

});
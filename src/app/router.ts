/* global Backbone, $, init, fp_pgc */

/// <reference path="../references.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
/// <reference path="../../typings/backbone/backbone.d.ts" />

'use strict';

// A router using Backbone and jQuery to list the DVD and display a player.

interface Window { dvd: Element; }
interface vmProceduresInterface { (): void; }
declare var init: vmProceduresInterface;
declare var fp_pgc: vmProceduresInterface;

var list = '<ul>' +
  '<% _.each(dvds, function(dvd) {%>' +
  '<li class="thumbnail" style="background-image:url(\'<%= dvd.dir %>/cover.jpg\');">' +
  '<a href="#/play/<%= dvd.dir %>"><span><%= dvd.name %></span></a>' +
  '<%= name %>' +
  '</li>' +
  '<% }); %>' +
  '</ul>';

var App = Backbone.Router.extend({
  routes: {
    'play': 'list',
    'play/:dvdId': 'play'
  },
  list: function() {
    $.getJSON('/dvds.json')
      .done(function(data) {
        data = data.sort(function(a, b) {
          return a.name > b.name;
        });
        $('.video-container').html(_.template(list, {dvds: data}));
      });
  },
  play: function(dvdId) {
    $.getJSON('/' + dvdId + '/web/metadata.json')
      .done(function(data) {
        $('.video-container').html(buildTag(data));

        var g = document.createElement('script');
        var s = document.scripts[0];
        g.src = dvdId + '/web/vm.js';
        s.parentNode.insertBefore(g, s);
        g.onload = function() {
          console.log('Start the DVD.');
          window.dvd = document.querySelector('x-video');

          init();

          // When everything is loaded and ready, start the playback.
          fp_pgc();
        };
      });
  }
});

Backbone.history.start();

var app = new App();

// Always execute the `play` route when starting.
app.navigate('play', {trigger: true});

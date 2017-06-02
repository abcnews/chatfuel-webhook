/* eslint-env node, mocha */
const fbcdn = require('../lib/fbcdn');
const assert = require('assert');

const images = [
  ['uploaded photo', 'https://scontent.xx.fbcdn.net/v/t34.0-12/12345_n.jpg?_nc_ad=z-m&oh=12123&oe=12123'],
  ['messenger sticker', 'https://scontent.xx.fbcdn.net/v/t39.1997-6/p100x100/12345_n.png?_nc_ad=z-m&oh=123123&oe=123123'],
];

const notImages = [
  ['undefined', undefined],
  ['null', null],
  ['an object', {}],
  ['fake fbcdn', 'https://example.org/fbcdn.net/foo.jpg'],
];

describe('fbcdn', () => {
  describe('success cases', () => {
    images.forEach(image => it(`it should recognise ${image[0]}`, () => {
      assert.deepEqual(fbcdn.isImage(image[1]), true, 'should return true');
    }));
  });

  describe('failure cases', () => {
    notImages.forEach(image => it(image[0], () => {
      assert.deepEqual(fbcdn.isImage(image[1]), false, 'should return false');
    }));
  });
});

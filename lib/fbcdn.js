const url = require('url');

const sanityCheck = urlString => typeof (urlString) === 'string' && urlString;

const fbcdn = {
  /**
   * Is this on the fbcdn?
   * @param  {String}  urlString A url to check
   * @return {Boolean}           True when the URL is on fbcdn, false otherwise
   */
  isFacebookContent(urlString) {
    if (!sanityCheck(urlString)) return false;

    // parse the URL
    const urlObject = url.parse(urlString);

    // probably not a url
    if (!urlObject.host) return false;

    // check it's fbcdn
    const fbcdnRegex = /fbcdn\.net$/;
    return !!urlObject.host.match(fbcdnRegex);
  },
  /**
   * Is this an image on the facebook CDN?
   * This is based on the URL rather than a content-type check, use appropriate caution
   * @param  {String}  urlString A url to check
   * @return {Boolean}           True when the url is a facebook image, false otherwise
   */
  isImage(urlString) {
    if (!sanityCheck(urlString)) return false;
    if (!fbcdn.isFacebookContent(urlString)) return false;
    const urlObject = url.parse(urlString);
    const imageRegex = /\.(png|jpg|gif)$/;
    return !!urlObject.pathname.match(imageRegex);
  },
};

module.exports = fbcdn;

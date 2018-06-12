const GitHubInterface = require('./GitHubInterface');

/**
 * @description Paginated GitHub API V3 URL
 * @export
 * @class PaginatedUrl
 */
module.exports = class PaginatedUrl {
  /**
   * @description Creates an instance of the PaginatedURL class.
   * @memberof PaginatedUrl
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.nextUrl = undefined;
    this.lastUrl = undefined;
    this.getFirstUrlResponse(baseUrl);
  }

  hasMorePages() {
    return this.nextUrl === undefined ? false : true;
  }

  async getFirstUrlResponse(url) {
    const response = await GitHubInterface.fetchFromApi(url);
    const linkUrls = this.extractLinkUrls(response.headers.link);
    console.log('first linkUrls: ', linkUrls);
    this.nextUrl = linkUrls.find(isNextUrl);
    this.lastUrl = linkUrls.find(isLastUrl);
    return response.data;
  }

  async getNextUrlResponse() {
    if (this.nextUrl === undefined) {
      return null;
    }
    const response = await GitHubInterface.fetchFromApi(this.nextUrl);
    const linkUrls = this.extractLinkUrls(response.headers.link);
    console.log('next linkUrls: ', linkUrls);
    this.nextUrl = linkUrls.find(isNextUrl);
    return response.data;
  }

  /**
   * @description Create an object describing the contents of a Link attribute
   * in a response header
   * @param {String} link Value of a response.headers.link attribute
   * @returns
   */
  extractLinkUrls(link) {
    const linkComponents = link.split(',');
    let parsedLinks = [];
    linkComponents.forEach((link) => {
      const linkSections = link.split(';');
      const linkUrl = linkSections[0].replace(/<(.*)>/, '$1').trim();
      const linkRel = linkSections[1].split('=')[1].slice(1, -1);
      parsedLinks.push({ linkUrl: linkUrl, rel: linkRel });
    });
    return parsedLinks;
  }

  isNextUrl(linkElement) {
    return linkElement.rel === "next";
  }

  isLastUrl(linkElement) {
    return linkElement.rel === "last";
  }

};

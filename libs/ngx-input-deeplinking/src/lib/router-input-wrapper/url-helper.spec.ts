import {replaceUrlPathParam, splitUrlAndQueryParams} from './url-helper';

describe('Splitting url params', () => {

  it('should split url and query params', () => {
    const testUrl = 'angular.io/resources?category=education';
    const expectedUrl = 'angular.io/resources';
    const expectedQueryParams = new URLSearchParams();
    expectedQueryParams.set('category', 'education')

    const {urlWithoutParams, urlQueryParams} = splitUrlAndQueryParams(testUrl);

    expect(urlWithoutParams).toEqual(expectedUrl);
    expect(urlQueryParams).toEqual(expectedQueryParams);
  });
})

describe('Replacing url path parameters', () => {

  it('should leave url as is if no param exists', () => {
    const currentUrl = '/books/sale';
    const routePathDefinition = 'books/sale';

    const result = replaceUrlPathParam(currentUrl, routePathDefinition, 'bookId', '2');

    expect(result).toEqual(currentUrl);
  });

  it('should correctly replace single parameter in url', () => {
    const currentUrl = '/books/1/editions';
    const routePathDefinition = 'books/:bookId/editions';

    const result = replaceUrlPathParam(currentUrl, routePathDefinition, 'bookId', '2');

    expect(result).toEqual('/books/2/editions');
  });

  it('should correctly replace url that consists of only a parameter', () => {
    const currentUrl = '/1';
    const routePathDefinition = ':bookId';

    const result = replaceUrlPathParam(currentUrl, routePathDefinition, 'bookId', '2');

    expect(result).toEqual('/2');
  });

  it('should preserve query params', () => {
    const currentUrl = '/books/1/editions?author=hitchcock';
    const routePathDefinition = 'books/:bookId/editions';

    const result = replaceUrlPathParam(currentUrl, routePathDefinition, 'bookId', '2');

    expect(result).toEqual('/books/2/editions?author=hitchcock');
  });

  it('should correctly replace the passed parameter if two parameters exist', () => {
    const currentUrl = '/books/1/pages/1/content';
    const routePathDefinition = 'books/:bookId/pages/:pageId/content';

    const result = replaceUrlPathParam(currentUrl, routePathDefinition, 'bookId', '2');

    expect(result).toEqual('/books/2/pages/1/content');
  });
});

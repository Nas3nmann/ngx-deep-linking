export function splitUrlAndQueryParams(url: string): { urlWithoutParams: string, urlQueryParams: URLSearchParams } {
  const urlParts = url.split('?');
  return {
    urlWithoutParams: urlParts[0],
    urlQueryParams: new URLSearchParams(urlParts[1])
  }
}

export function replaceUrlPathParam(currentUrl: string,
                                    pathDefinition: string,
                                    parameterName: string,
                                    parameterValue: string): string {
  currentUrl = removeLeadingSlash(currentUrl);
  const urlSegments = currentUrl.split('/');
  const pathDefinitionSegments = pathDefinition.split('/');

  const parameterSegmentIndex = pathDefinitionSegments.findIndex(segment => segment === `:${parameterName}`);
  if (parameterSegmentIndex >= 0) {
    urlSegments[parameterSegmentIndex] = parameterValue;
  }
  return `/${urlSegments.join('/')}`;
}

function removeLeadingSlash(currentUrl: string) {
  return currentUrl.startsWith('/') ? currentUrl.slice(1) : currentUrl;
}

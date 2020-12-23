const moduleName = 'ruleable';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  rules: `${urlBase}/rules`,
  fromConfig: `${urlBase}/rules/fromConfig`,
}

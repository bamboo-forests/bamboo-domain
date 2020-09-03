import Domain from './Domain';

const singleton = new Domain();
singleton.Domain = Domain;

export default singleton;

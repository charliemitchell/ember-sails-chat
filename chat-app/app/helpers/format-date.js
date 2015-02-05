import Ember from 'ember';

/* format-date
*@param input > type: non-scalar (must be able to be parsed by moment.js)
*/
export function formatDate(input) {
  return new moment(input).format('llll');
}

export default Ember.Handlebars.makeBoundHelper(formatDate);

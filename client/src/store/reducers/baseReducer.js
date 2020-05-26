export default class BaseReducer {
  initialState = {};

  //eslint-disable-next-line default-param-last
  reducer = (state = this.initialState, action) => {
    const method = this[action.type];

    if (!method || action.error) {
      return state;
    }

    return method.call(this, state, action);
  };
}

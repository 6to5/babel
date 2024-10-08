var _Contact;
const title = "Neem contact op";
function action() {
  return babelHelpers.callAsync(function* () {
    return _Contact || (_Contact = /*#__PURE__*/React.createElement(Contact, {
      title: title
    }));
  }, this, arguments);
}

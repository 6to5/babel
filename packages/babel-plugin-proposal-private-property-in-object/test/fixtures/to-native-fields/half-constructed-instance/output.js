var _temp, _temp2;

var _FBrandCheck = new WeakSet();

var _xBrandCheck = new WeakSet();

var _yBrandCheck = new WeakSet();

class F {
  m() {
    _FBrandCheck.has(this);

    _xBrandCheck.has(this);

    _yBrandCheck.has(this);

    _FBrandCheck.has(this);
  }

  get #w() {}

  #x = (_temp = (_FBrandCheck.add(this), 0), _xBrandCheck.add(this), _temp);
  #y = (_temp2 = (() => {
    throw 'error';
  })(), _yBrandCheck.add(this), _temp2);

  #z() {}

}

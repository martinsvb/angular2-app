describe('Home', () => {

  beforeEach( () => {
    browser.get('/');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-home h2')).getText()).toEqual('Features');
  });

});

import { ScvoFrontendPage } from './app.po';

describe('scvo-frontend App', function() {
  let page: ScvoFrontendPage;

  beforeEach(() => {
    page = new ScvoFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

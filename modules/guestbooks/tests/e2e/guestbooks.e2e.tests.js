'use strict';

describe('guestbooks E2E Tests:', function() {
	describe('Test guestbooks page', function() {
		it('Should report missing credentials', function() {
			browser.get('http://localhost:3000/#!/guestbooks');
			expect(element.all(by.repeater('guestbook in guestbooks')).count()).toEqual(0);
		});
	});
});

var expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = 'admin';
        const text = 'Welcome';
        const message = generateMessage(from, text);

        // expect(message.from).toBe(from);
        // expect(message.text).toBe(text);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'admin';
        const latitude = 1;
        const longitude = 1;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            url
        });
    });
});
import buttonText from './../../src/js/lib/buttonText.js'

test('Test buttonText', () => {
    const name = 'peter',
        expectedText = `click here, ${name}`;
    expect(buttonText(name)).toBe(expectedText);
});
import Nightmare from 'nightmare';

test('Test buttonText', (done) => {
    let nightmare = Nightmare();
    nightmare.goto(`http://localhost:${process.env.E2E_PORT}/test/e2e/htdocs/`)
        .evaluate(function () {
            return document.querySelector('#container button').textContent;
        })
        .then(function (text) {
            expect(text).toBe(`click here, Tom`);
            done();
        });

});

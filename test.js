import test from 'ava';
import a from '.';

const effects = Object.keys(a);

for (const effect of effects) {
	test(`throw error if invalid speed (${effect})`, t => {
		t.throws(() => a[effect]('abc', ''), `Expected \`speed\` to be an number greater than 0`);
	});

	test.cb(`animations are starting automatically (${effect})`, t => {
		const an = a[effect]('Lorem ipsum\ndolor sit amet', effect === 'neon' ? 100 : 10);
		setTimeout(() => {
			t.true(an.f > 1);
			t.end();
		}, 20);
	});

	test.cb(`console.log stops the animation (${effect})`, t => {
		const an = a[effect]('Lorem ipsum\ndolor sit amet');
		setTimeout(() => {
			t.is(an.stopped, false);
			console.log('Test log');
			t.is(an.stopped, true);
			t.end();
		}, 20);
	});

	test(`start and stop are working (${effect})`, t => {
		const an = a[effect]('Lorem ipsum\ndolor sit amet');
		t.is(an.stopped, false);
		an.stop();
		t.is(an.stopped, true);
		an.start();
		t.is(an.stopped, false);
	});

	test(`manual render is working (${effect})`, t => {
		const an = a[effect]('Lorem ipsum\ndolor sit amet').stop();
		t.is(an.f, 0);
		an.render();
		t.is(an.f, 1);
		an.render();
		t.is(an.f, 2);
	});

	test(`frames are always different (${effect})`, t => {
		if (['pulse', 'glitch'].indexOf(effect) > -1) {
			return t.pass(); // Ignore some animations
		}
		const an = a[effect]('Lorem ipsum\ndolor sit amet').stop();
		let frame = '';
		for (let i = 0; i < 10; i++) {
			const lastFrame = frame;
			frame = an.frame();
			t.not(frame, lastFrame);
		}
	});

	test(`text can be replaced (${effect})`, t => {
		if (['radar'].indexOf(effect) > -1) {
			return t.pass(); // Ignore some animations
		}

		const an = a[effect]('Y Y Y').stop();
		const f1 = an.frame();
		an.replace('Z Z Z');
		const f2 = an.frame();

		t.true(f1.indexOf('Y') > -1);
		t.false(f1.indexOf('Z') > -1);

		t.false(f2.indexOf('Y') > -1);
		t.true(f2.indexOf('Z') > -1);
	});

	test(`multiline is well supported (${effect})`, t => {
		const an = a[effect]('Lorem\nipsum\ndolor\nsit\namet').stop();
		const frame = an.frame();
		t.is(an.lines, 5);
		t.is(frame.split('\n').length, 5);
	});

	test.cb(`forced start is not a problem (${effect})`, t => {
		t.notThrows(() => setTimeout(() => {
			a[effect]('Lorem ipsum\ndolor sit amet', 10).start();
			t.end();
		}), 20);
	});

	test(`test lots of frames (${effect})`, t => {
		const an = a[effect]('Lorem ipsum\ndolor sit amet').stop();
		for (let i = 0; i < 1000; i++) {
			t.notThrows(() => an.render());
		}
	});
}

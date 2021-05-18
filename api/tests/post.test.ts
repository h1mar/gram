import request from 'supertest';
import { app } from '../src/server';

describe('GET /post feed', function () {
	it('responds with json', function (done) {
		request(app)
			.get('/post')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});

describe('GET /post', function () {
	it('responds with json', function (done) {
		request(app)
			.get('/post/926c3a00-6158-4310-9454-f67c1cfd3866')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});

describe('POST /post', function () {
	it('responds with json', function (done) {
		request(app)
			.post('/post')
			.set('Accept', 'application/json')
			.expect(401, done);
	});
});
